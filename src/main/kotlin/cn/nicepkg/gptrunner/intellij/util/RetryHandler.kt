package cn.nicepkg.gptrunner.intellij.util

import kotlinx.coroutines.delay
import kotlin.math.pow

class RetryHandler {
    suspend fun <T> retry(
        times: Int = 3,
        initialDelay: Long = 100,
        maxDelay: Long = 1000,
        factor: Double = 2.0,
        block: suspend () -> T
    ): T {
        var currentDelay = initialDelay
        repeat(times - 1) {
            try {
                return block()
            } catch (e: Exception) {
                // 记录错误
            }
            delay(currentDelay)
            currentDelay = (currentDelay * factor).toLong().coerceAtMost(maxDelay)
        }
        return block() // 最后一次尝试
    }
}
