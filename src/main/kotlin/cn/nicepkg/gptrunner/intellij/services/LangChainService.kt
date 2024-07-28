// src/main/kotlin/cn/nicepkg/gptrunner/intellij/services/LangChainService.kt

package cn.nicepkg.gptrunner.intellij.services

interface LangChainService {
    suspend fun getCodeSuggestion(context: String): String
    fun formatCode(code: String): String

    suspend fun convertCode(code: String, targetLanguage: String): String


}
