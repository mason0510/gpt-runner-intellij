package cn.nicepkg.gptrunner.intellij.lang

class LanguageProcessorFactory {
    fun getProcessor(language: String): LanguageProcessor {
        return when (language.toLowerCase()) {
            "kotlin" -> KotlinProcessor()
            "python" -> PythonProcessor()
            "javascript" -> JavaScriptProcessor()
            "go" -> JavaScriptProcessor()
            else -> throw IllegalArgumentException("Unsupported language: $language")
        }
    }
}
class PythonProcessor : LanguageProcessor {
    override fun processContext(context: String): String {
        // Python 特定的处理逻辑
        return context // 简单示例，实际中可能需要更复杂的处理
    }
    override fun getLanguageSpecificPrompt(): String {
        return "You are a Go expert. Please provide idiomatic Go code suggestions."
    }

}

class JavaScriptProcessor : LanguageProcessor {
    override fun processContext(context: String): String {
        // JavaScript 特定的处理逻辑
        return context // 简单示例，实际中可能需要更复杂的处理
    }
    override fun getLanguageSpecificPrompt(): String {
        return "You are a Go expert. Please provide idiomatic Go code suggestions."
    }
}

class GoProcessor : LanguageProcessor {
    override fun processContext(context: String): String {
        // 实现 Go 特定的上下文处理逻辑
        return context // 或返回处理后的上下文
    }

    override fun getLanguageSpecificPrompt(): String {
        return "You are a Go expert. Please provide idiomatic Go code suggestions."
    }
}


class KotlinProcessor : LanguageProcessor {
    override fun processContext(context: String): String {
        // Kotlin 特定的处理逻辑
        return context // 简单示例，实际中可能需要更复杂的处理
    }
    override fun getLanguageSpecificPrompt(): String {
        return "You are a Go expert. Please provide idiomatic Go code suggestions."
    }
}
