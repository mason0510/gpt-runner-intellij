package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.LangChainService
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.Project
import dev.langchain4j.model.openai.OpenAiChatModel
import dev.langchain4j.model.input.PromptTemplate
import dev.langchain4j.model.chat.ChatLanguageModel
import kotlinx.coroutines.*
import java.util.concurrent.atomic.AtomicReference
import kotlin.coroutines.CoroutineContext

class LangChainServiceImpl(private val project: Project) : LangChainService {
    private val logger = Logger.getInstance(LangChainServiceImpl::class.java)

    private val model: ChatLanguageModel = OpenAiChatModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY") ?: "demo")
        .baseUrl(System.getenv("OPENAI_API_BASE") ?: "https://api.zyai.online/v1")
        .modelName(System.getenv("OPENAI_MODEL_NAME") ?: "claude-3-5-sonnet-20240620")
        .temperature(0.9)
        .build()

    private val cursorStopDelay = 30L
    private val lastCursorPosition = AtomicReference<Pair<Int, Int>>()
    private var lastRequestJob: Job? = null

    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val throttleInterval = 100L
    private var lastRequestTime = 0L

    private var isGenerating = false

    private val uiDispatcher = object : CoroutineDispatcher() {
        override fun dispatch(context: CoroutineContext, block: Runnable) {
            ApplicationManager.getApplication().invokeLater(block)
        }
    }

    fun onCursorMoved(line: Int, column: Int, getCurrentContext: () -> String) {
        lastCursorPosition.set(Pair(line, column))
        lastRequestJob?.cancel()
        if (isGenerating) return
        lastRequestJob = coroutineScope.launch {
            delay(cursorStopDelay)
            val currentPosition = lastCursorPosition.get()
            if (currentPosition.first == line && currentPosition.second == column) {
                val currentTime = System.currentTimeMillis()
                if (currentTime - lastRequestTime >= throttleInterval) {
                    lastRequestTime = currentTime
                    val context = withContext(Dispatchers.Default) { getCurrentContext() }
                    val (prefix, suffix) = extractPrefixAndSuffix(context)
                    if (scoreContext(prefix, suffix) >= 0.5) {
                        getCodeSuggestion(context)
                    }
                }
            }
        }
    }

    override suspend fun getCodeSuggestion(context: String): String = withContext(Dispatchers.Default) {
        try {
            if (context.isEmpty()) {
                logger.warn("Empty context provided")
                return@withContext ""
            }
            val (prefix, suffix) = extractPrefixAndSuffix(context)
            generateSuggestion(prefix, suffix)
        } catch (e: Exception) {
            logger.error("Error generating code suggestion: ${e.javaClass.simpleName} - ${e.message}", e)
            "Error: ${e.javaClass.simpleName} - ${e.message}"
        }
    }

    private suspend fun generateSuggestion(prefix: String, suffix: String): String = withContext(Dispatchers.Default) {
        val promptTemplate = PromptTemplate.from(
            """
            As GitHub Copilot, analyze the following code context and provide a concise suggestion to extend or improve it. 
            The cursor position is indicated by |. Your task is to provide code completion based on the code before and after the cursor.

            Code context:
            {{context}}

            Requirements:
            1. Provide only code without explanations or markdown
            2. Do not include backticks or language specifiers
            3. The code should be ready to insert directly at the cursor position (where | is)
            4. Keep the suggestion concise and directly related to the current context
            5. Focus on improving or extending the existing code, not adding unrelated functions
            6. Do not generate content that may violate copyrights
            7. Add concise Chinese comments to important code lines
            8. Consider the code before and after the cursor position and ensure the suggestion integrates seamlessly
            9. The suggestion should continue the current code structure and logic

            Steps:
            1. Analyze the given code context, paying attention to the code before and after the cursor position
            2. Identify areas for immediate improvement or extension within the existing scope
            3. Design a concise code snippet that directly enhances the current functionality
            4. Ensure the suggestion fits logically with the code before and after the cursor position
            5. Add brief Chinese comments to explain key parts of the suggested code
            6. Output only the code suggestion with Chinese comments

            Code suggestion:
            """
        )

        val prompt = promptTemplate.apply(mapOf("context" to "$prefix|$suffix"))
        val response = model.generate(prompt.text())

        cleanAndFormatResponse(response)
    }

    private fun cleanAndFormatResponse(response: String): String {
        return response
            .replace("```go", "").replace("```", "")
            .lines()
            .filter { it.trim().isNotEmpty() }
            .joinToString("\n")
            .trim()
    }

    override fun formatCode(code: String): String {
        val lines = code.lines()
        val formattedLines = StringBuilder()
        var indentLevel = 0
        var inComment = false

        lines.forEach { line ->
            val trimmedLine = line.trim()

            if (trimmedLine.startsWith("/*")) inComment = true
            if (trimmedLine.endsWith("*/")) inComment = false

            if (trimmedLine.startsWith("}") || trimmedLine.startsWith(")")) {
                indentLevel = (indentLevel - 1).coerceAtLeast(0)
            }

            val indent = "    ".repeat(indentLevel)

            if (trimmedLine.isNotEmpty()) {
                formattedLines.append(indent).append(trimmedLine).append("\n")
            } else {
                formattedLines.append("\n")
            }

            if (!inComment && (trimmedLine.endsWith("{") || trimmedLine.endsWith("("))) {
                indentLevel++
            }
        }

        return formattedLines.toString().trimEnd()
    }

    override suspend fun convertCode(code: String, targetLanguage: String): String = withContext(Dispatchers.Default) {
        val promptTemplate = PromptTemplate.from(
            """
            Convert the following code to {{targetLanguage}}.
            Only provide the converted code without any explanations or comments.
            The code should be ready to be directly used in a {{targetLanguage}} file.

            Original code:
            {{code}}

            Converted {{targetLanguage}} code:
            """
        )

        val prompt = promptTemplate.apply(mapOf(
            "code" to code,
            "targetLanguage" to targetLanguage
        ))
        val response = model.generate(prompt.text())

        cleanAndFormatResponse(response)
    }

    private fun extractPrefixAndSuffix(context: String): Pair<String, String> {
        val parts = context.split("|", limit = 2)
        return Pair(parts.getOrElse(0) { "" }, parts.getOrElse(1) { "" })
    }

    private fun scoreContext(prefix: String, suffix: String): Double {
        // Implement context scoring logic if needed
        return 1.0 // Example return value
    }
}
