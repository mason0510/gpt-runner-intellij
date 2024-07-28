package cn.nicepkg.gptrunner.intellij.scoring

import dev.langchain4j.model.chat.ChatLanguageModel

class RequestScorer(private val model: ChatLanguageModel) {
    suspend fun scoreRequest(context: String): Double {
        val prompt = "Rate the likelihood that this code context needs completion (0-1):\n$context"
        val response = model.generate(prompt)
        return response.toDoubleOrNull() ?: 0.0
    }
}
