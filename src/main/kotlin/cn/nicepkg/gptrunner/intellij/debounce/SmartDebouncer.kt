package cn.nicepkg.gptrunner.intellij.debounce

import kotlin.math.exp

class SmartDebouncer(private val contextualScoreCalculator: ContextualScoreCalculator) {
    suspend fun getDebounceTime(context: String): Long {
        val contextualScore = contextualScoreCalculator.calculate(context)
        val baseTime = 75L
        val maxTime = 500L
        return (baseTime + (maxTime - baseTime) / (1 + exp((contextualScore - 0.5) * 10))).toLong()
    }
}
