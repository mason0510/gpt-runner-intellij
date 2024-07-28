package cn.nicepkg.gptrunner.intellij.lang

class KotlinProcessor : LanguageProcessor {
    override fun processContext(context: String): String {
        // Kotlin 特定的处理逻辑
        return context // 简单示例，实际中可能需要更复杂的处理
    }
}
