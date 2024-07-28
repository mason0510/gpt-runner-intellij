package cn.nicepkg.gptrunner.intellij.debounce

import kotlin.math.exp
class ContextualScoreCalculator {
    private val tokenizer = SimpleTokenizer()

    fun calculate(context: String): Double {
        val tokens = tokenizer.tokenize(context)
        val relevantTokens = tokens.filter { it.isRelevant() }
        return relevantTokens.size.toDouble() / tokens.size
    }

    private fun String.isRelevant(): Boolean {
        // 简单的相关性判断逻辑，可以根据需要扩展
        return this.length > 2 && !SimpleTokenizer.stopWords.contains(this.toLowerCase())
    }
}
