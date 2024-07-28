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
        .modelName(System.getenv("OPENAI_MODEL_NAME") ?: "gpt-3.5-turbo")
        .temperature(0.7)
        .build()

    override suspend fun getCodeSuggestion(context: String): String = withContext(Dispatchers.IO) {
        val promptTemplate = PromptTemplate.from(
            """
            You are an AI programming assistant. Given the following Java code context, provide a concise code suggestion to extend or improve the existing code. 
            Only provide the actual Java code without any explanations, comments, or markdown formatting.
            Do not include backticks or language specifiers.
            The code should be ready to be directly inserted into a Java file.

            Context:
            {{context}}

            Provide a concise code suggestion to insert at the current cursor position:
            """
        )

        val prompt = promptTemplate.apply(mapOf("context" to context))
        val response = model.generate(prompt.text())

        // 清理和格式化响应
        val cleanedResponse = cleanAndFormatResponse(response)

        // 打印清理后的响应（用于调试）
        println("Cleaned response: $cleanedResponse")

        // 返回清理后的响应
        cleanedResponse
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



}
