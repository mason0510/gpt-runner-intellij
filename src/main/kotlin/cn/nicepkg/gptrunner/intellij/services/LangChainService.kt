// src/main/kotlin/cn/nicepkg/gptrunner/intellij/services/LangChainService.kt

package cn.nicepkg.gptrunner.intellij.services

interface LangChainService {
    suspend fun getCodeSuggestion(context: String): String
}
