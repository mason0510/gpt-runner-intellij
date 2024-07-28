package cn.nicepkg.gptrunner.intellij.experiment

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import java.net.URL

class ExperimentManager {
    private val experiments = mutableMapOf<String, Boolean>()

    suspend fun loadExperiments() = withContext(Dispatchers.IO) {
        try {
            val url = URL("https://your-experiment-config-url.com")
            val jsonString = url.readText()
            experiments.putAll(Json.decodeFromString(jsonString))
        } catch (e: Exception) {
            // 处理加载实验配置错误

        }
    }

    fun isExperimentEnabled(experimentName: String): Boolean {
        return experiments[experimentName] ?: false
    }
}
