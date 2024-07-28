package cn.nicepkg.gptrunner.intellij.debounce

import kotlin.math.exp

class SimpleTokenizer {
    companion object {
        val stopWords = setOf("the", "is", "at", "which", "on")
    }

    fun tokenize(text: String): List<String> {
        return text.toLowerCase().split(Regex("\\W+"))
            .filter { it.isNotEmpty() && it !in stopWords }
    }
}
