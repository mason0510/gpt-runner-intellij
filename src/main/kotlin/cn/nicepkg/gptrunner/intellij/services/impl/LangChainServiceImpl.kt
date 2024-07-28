package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.LangChainService
import com.intellij.openapi.diagnostic.Logger
import dev.langchain4j.model.openai.OpenAiChatModel
import dev.langchain4j.model.input.PromptTemplate
import dev.langchain4j.model.chat.ChatLanguageModel
import kotlinx.coroutines.*
import java.util.concurrent.atomic.AtomicReference
import java.io.File
import java.security.MessageDigest
import cn.nicepkg.gptrunner.intellij.cache.CacheManager
import cn.nicepkg.gptrunner.intellij.experiment.ExperimentManager
import cn.nicepkg.gptrunner.intellij.util.RetryHandler
import cn.nicepkg.gptrunner.intellij.feedback.FeedbackCollector
import cn.nicepkg.gptrunner.intellij.analysis.CodeAnalyzer
import cn.nicepkg.gptrunner.intellij.lang.LanguageProcessorFactory
import com.intellij.openapi.project.ProjectManager
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.fileEditor.FileDocumentManager
import com.intellij.openapi.project.Project
class LangChainServiceImpl : LangChainService {
    companion object {
        @Volatile
        private var instance: LangChainServiceImpl? = null

        fun getInstance(): LangChainServiceImpl {
            return instance ?: synchronized(this) {
                instance ?: LangChainServiceImpl().also { instance = it }
            }
        }
    }

    private val logger = Logger.getInstance(LangChainServiceImpl::class.java)

    private val cacheManager by lazy { CacheManager(File(System.getProperty("user.home"), ".gptrunner_cache.json")) }
    private val experimentManager by lazy { ExperimentManager() }
    private val retryHandler by lazy { RetryHandler() }
    private val feedbackCollector by lazy { FeedbackCollector() }
    private val codeAnalyzer by lazy { CodeAnalyzer() }
    private val languageProcessorFactory by lazy { LanguageProcessorFactory() }

    private val suggestionModel: ChatLanguageModel = OpenAiChatModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY") ?: "sk-")
        .baseUrl(System.getenv("OPENAI_API_BASE") ?: "https://api.zyai.online/v1")
        .modelName(System.getenv("OPENAI_MODEL_NAME") ?: "claude-3-5-sonnet-20240620")
        .temperature(0.7)
        .build()

    private val scoringModel: ChatLanguageModel = OpenAiChatModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY") ?: "demo")
        .baseUrl(System.getenv("OPENAI_API_BASE") ?: "https://api.openai.com/v1")
        .modelName("gpt-4")
        .temperature(0.0)
        .build()

    private val cursorStopDelay = 30L
    private var lastCursorPosition = AtomicReference<Pair<Int, Int>>()
    private var lastRequestJob: Job? = null

    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val throttleInterval = 100L
    private var lastRequestTime = 0L

    private var isGenerating = false
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
                        launch { getCodeSuggestion(context) }
                    }
                }
            }
        }
    }

    override suspend fun getCodeSuggestion(context: String): String = withContext(Dispatchers.IO) {
        try {
            if (context.isEmpty()) {
                logger.warn("Empty context provided")
                return@withContext ""
            }
            val (prefix, suffix) = extractPrefixAndSuffix(context)
            val promptKey = calculatePromptKey(prefix, suffix)

            cacheManager.get(promptKey)?.let {
                logger.info("Cache hit for key: $promptKey")
                return@withContext it
            }

            logger.info("Cache miss for key: $promptKey")

            val suggestion = retryHandler.retry { generateSuggestion(prefix, suffix) }
            val completionPart = extractCompletionPart(suggestion, prefix, suffix)
            cacheManager.put(promptKey, completionPart)

            completionPart
        } catch (e: Exception) {
            logger.error("Error generating code suggestion", e)
            ""
        }
    }
    // LangChainServiceImpl.kt
    private fun getCurrentFileLanguage(): String {
        val project: Project? = ProjectManager.getInstance().openProjects.firstOrNull()
        if (project == null) {
            logger.warn("No open project found")
            return "unknown"
        }
        val editor = FileEditorManager.getInstance(project).selectedTextEditor
        val file = editor?.document?.let { FileDocumentManager.getInstance().getFile(it) }
        return when (file?.fileType?.name?.toLowerCase()) {
            "go" -> "go"
            "java" -> "java"
            "kotlin" -> "kotlin"
            else -> {
                logger.warn("Unknown file type: ${file?.fileType?.name}")
                "unknown"
            }
        }
    }


    private suspend fun generateSuggestion(prefix: String, suffix: String): String {
        val fileLanguage = getCurrentFileLanguage()
        logger.info("Detected file language: $fileLanguage")
        val languageProcessor = languageProcessorFactory.getProcessor(detectLanguage(prefix))
        val processedContext = languageProcessor.processContext(prefix + suffix)
        val codeAnalysis = codeAnalyzer.analyzeContext(processedContext)

        val promptTemplate = PromptTemplate.from(
            """
            Provide a code suggestion based on the following context:
            Prefix: {{prefix}}
            Suffix: {{suffix}}
            Code Analysis: {{codeAnalysis}}
            Requirements:
            1. Only code, no explanations
            2. Concise and directly related to the context
            3. Ready to insert at cursor position
            4. Add brief Chinese comments for key lines
            5. Ensure high quality and best practices
            Suggestion:
            """
        )

        val prompt = promptTemplate.apply(
            mapOf(
                "prefix" to prefix,
                "suffix" to suffix,
                "codeAnalysis" to codeAnalysis.toString()
            )
        )
        val response = suggestionModel.generate(prompt.text())
        return cleanAndFormatResponse(response)
    }

    private suspend fun scoreContext(prefix: String, suffix: String): Double = withContext(Dispatchers.Default) {
        try {
            val promptTemplate = PromptTemplate.from(
                """
        Rate the likelihood that this code context needs completion (0-1):
        Prefix: {{prefix}}
        Suffix: {{suffix}}
        Only respond with a number between 0 and 1.
        """
            )

            val prompt = promptTemplate.apply(
                mapOf(
                    "prefix" to prefix,
                    "suffix" to suffix
                )
            )
            val response = scoringModel.generate(prompt.text())

            // 尝试从内容中提取数字
            val numberRegex = """[-+]?[0-9]*\.?[0-9]+""".toRegex()
            val matchResult = numberRegex.find(response)

            matchResult?.value?.toDoubleOrNull() ?: 0.0
        } catch (e: Exception) {
            logger.error("Error in scoreContext", e)
            0.0
        }
    }


    private fun extractCompletionPart(suggestion: String, prefix: String, suffix: String): String {
        val startIndex = suggestion.indexOf(prefix)
        val endIndex = suggestion.lastIndexOf(suffix)

        if (startIndex == -1 || endIndex == -1 || startIndex >= endIndex) {
            return suggestion // 如果无法正确提取，则返回整个建议
        }

        return suggestion.substring(startIndex + prefix.length, endIndex).trim()
    }

    private fun extractPrefixAndSuffix(context: String): Pair<String, String> {
        val cursorIndex = context.indexOf('|')
        if (cursorIndex == -1) {
            return Pair(context, "")
        }
        val prefix = context.substring(0, cursorIndex).takeIf { it.isNotEmpty() } ?: ""
        val suffix = context.substring(cursorIndex + 1).takeIf { it.isNotEmpty() } ?: ""
        return Pair(prefix, suffix)
    }

    private fun calculatePromptKey(prefix: String, suffix: String): String {
        val content = prefix + suffix
        return MessageDigest.getInstance("SHA-256")
            .digest(content.toByteArray())
            .fold("") { str, it -> str + "%02x".format(it) }
    }

    private fun cleanAndFormatResponse(response: String): String {
        return response
            .replace("```kotlin", "").replace("```", "")
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

    override suspend fun convertCode(code: String, targetLanguage: String): String = withContext(Dispatchers.IO) {
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

        val prompt = promptTemplate.apply(
            mapOf(
                "code" to code,
                "targetLanguage" to targetLanguage
            )
        )
        val response = suggestionModel.generate(prompt.text())

        cleanAndFormatResponse(response)
    }

    private fun detectLanguage(code: String): String {
        return when {
            code.contains("package ") || code.contains("func ") || code.contains("import (") -> "go"
            code.contains("fun ") || code.contains("val ") || code.contains("var ") -> "kotlin"
            code.contains("def ") || code.contains("class ") || code.contains("import ") -> "python"
            code.contains("function ") || code.contains("var ") || code.contains("let ") -> "javascript"
            else -> "unknown"
        }
    }

    fun destroy() {
        coroutineScope.cancel()
        logger.info("LangChainServiceImpl destroyed")
        //打印helloworld

    }



}
