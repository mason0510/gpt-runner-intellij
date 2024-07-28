package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.LangChainService
import dev.langchain4j.model.openai.OpenAiChatModel
import dev.langchain4j.model.input.PromptTemplate
import dev.langchain4j.model.chat.ChatLanguageModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class LangChainServiceImpl : LangChainService {
    private val model: ChatLanguageModel = OpenAiChatModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY") ?: "demo")
        .baseUrl(System.getenv("OPENAI_API_BASE") ?: "https")
        .modelName(System.getenv("OPENAI_MODEL_NAME") ?: "claude-3-5-sonnet-20240620")
        .temperature(0.7)
        .build()

    override suspend fun getCodeSuggestion(context: String): String = withContext(Dispatchers.IO) {
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

        val prompt = promptTemplate.apply(mapOf("context" to context))
        val response = model.generate(prompt.text())

        cleanAndFormatResponse(response)
    }

    private fun cleanAndFormatResponse(response: String): String {
        return response
            .replace("```java", "").replace("```", "") // 移除可能的Markdown代码块标记
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

            // 处理多行注释的开始和结束
            if (trimmedLine.startsWith("/*")) inComment = true
            if (trimmedLine.endsWith("*/")) inComment = false

            // 调整缩进级别
            if (trimmedLine.startsWith("}") || trimmedLine.startsWith(")")) {
                indentLevel = (indentLevel - 1).coerceAtLeast(0)
            }

            val indent = "    ".repeat(indentLevel)

            // 对于非空行应用缩进
            if (trimmedLine.isNotEmpty()) {
                formattedLines.append(indent).append(trimmedLine).append("\n")
            } else {
                formattedLines.append("\n") // 保留空行，但不缩进
            }

            // 增加缩进级别
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

        val prompt = promptTemplate.apply(mapOf(
            "code" to code,
            "targetLanguage" to targetLanguage
        ))
        val response = model.generate(prompt.text())

        cleanAndFormatResponse(response)
    }
}
