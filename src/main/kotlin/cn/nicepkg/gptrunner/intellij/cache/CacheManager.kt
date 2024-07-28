package cn.nicepkg.gptrunner.intellij.cache

import java.io.File
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.concurrent.ConcurrentHashMap
import kotlinx.serialization.*
import kotlinx.serialization.json.*

@Serializable
data class CacheItem(val content: String, val timestamp: Long)

class CacheManager(private val cacheFile: File) {
    private val cache = ConcurrentHashMap<String, CacheItem>()
    private val cacheSize = 1000
    private val cacheDuration = 3L // 缓存持续时间（天）

    init {
        loadCache()
    }

    suspend fun get(key: String): String? {
        val cacheItem = cache[key] ?: return null
        val now = Instant.now()
        return if (ChronoUnit.DAYS.between(Instant.ofEpochMilli(cacheItem.timestamp), now) < cacheDuration) {
            cacheItem.content
        } else {
            cache.remove(key)
            null
        }
    }

    suspend fun put(key: String, value: String) {
        val now = Instant.now()
        cache[key] = CacheItem(value, now.toEpochMilli())
        if (cache.size > cacheSize) {
            val removeCount = (cacheSize * 0.1).toInt()
            val removedItems = cache.entries
                .sortedBy { it.value.timestamp }
                .take(removeCount)
            removedItems.forEach { cache.remove(it.key) }
        }
        saveCache()
    }

    private fun loadCache() {
        if (cacheFile.exists()) {
            try {
                val json = cacheFile.readText()
                val cacheMap: Map<String, CacheItem> = Json.decodeFromString(json)
                cache.putAll(cacheMap)
                cleanCache()
            } catch (e: Exception) {
                // 处理加载缓存错误
            }
        }
    }

    private fun saveCache() {
        try {
            val json = Json.encodeToString(cache as Map<String, CacheItem>)
            cacheFile.writeText(json)
        } catch (e: Exception) {
            // 处理保存缓存错误
        }
    }

    private fun cleanCache() {
        val now = Instant.now()
        cache.entries.removeIf { (_, cacheItem) ->
            ChronoUnit.DAYS.between(Instant.ofEpochMilli(cacheItem.timestamp), now) >= cacheDuration
        }
        saveCache()
    }
}
