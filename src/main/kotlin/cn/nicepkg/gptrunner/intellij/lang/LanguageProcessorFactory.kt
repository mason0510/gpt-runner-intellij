package cn.nicepkg.gptrunner.intellij.lang

class LanguageProcessorFactory {
    fun getProcessor(language: String): LanguageProcessor {
        return when (language.toLowerCase()) {
            "kotlin" -> KotlinProcessor()
            "python" -> PythonProcessor()
            "javascript" -> JavaScriptProcessor()
            else -> throw IllegalArgumentException("Unsupported language: $language")
        }
    }
}
class PythonProcessor : LanguageProcessor {
    override fun processContext(context: String): String {
        // Python 特定的处理逻辑
        return context // 简单示例，实际中可能需要更复杂的处理
    }
}

class JavaScriptProcessor : LanguageProcessor {
    override fun processContext(context: String): String {
        // JavaScript 特定的处理逻辑
        return context // 简单示例，实际中可能需要更复杂的处理
    }
}
