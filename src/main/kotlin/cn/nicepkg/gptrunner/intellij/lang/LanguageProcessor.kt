package cn.nicepkg.gptrunner.intellij.lang

interface LanguageProcessor {
    fun processContext(context: String): String
    fun getLanguageSpecificPrompt(): String
}

