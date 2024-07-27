package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.AbstractService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import com.intellij.openapi.diagnostic.Logger
import org.apache.commons.lang3.SystemUtils
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import kotlin.io.path.*

class GPTRunnerExecutableService : AbstractService(), IGPTRunnerExecutableService {
  private val logger = Logger.getInstance(GPTRunnerExecutableService::class.java)

  override val userHome = SystemUtils.getUserHome().toPath()
  override val gptRunnerExecutablesDir = userHome.resolve(".gpt-runner")
  override val gptRunnerExecutableDir = gptRunnerExecutablesDir.resolve("GPT-Runner-${plugin.version}")

  init {
    try {
      initializeExecutable()
    } catch (e: Exception) {
      logger.error("Failed to initialize GPT Runner executable", e)
    }
  }

  private fun initializeExecutable() {
    if (!gptRunnerExecutableDir.exists()) {
      try {
        gptRunnerExecutableDir.createDirectories()
        unzipGPTRunnerExecutable()
      } catch (e: IOException) {
        logger.error("Failed to create directory or unzip executable", e)
      }
    } else if (gptRunnerExecutableDir.listDirectoryEntries().isEmpty()) {
      try {
        unzipGPTRunnerExecutable()
      } catch (e: IOException) {
        logger.error("Failed to unzip executable", e)
      }
    }
  }

  private fun unzipGPTRunnerExecutable() {
    val zipStream = javaClass.getResourceAsStream("/dist.zip")
    if (zipStream == null) {
      logger.error("dist.zip resource not found")
      return
    }

    try {
      ZipInputStream(zipStream).use { zis ->
        var nextEntry: ZipEntry?
        while (zis.nextEntry.also { nextEntry = it } != null) {
          val name: String = nextEntry!!.name
          val isDir = nextEntry!!.isDirectory

          val toFile = gptRunnerExecutableDir.resolve(name).normalize()
          if (isDir) {
            if (!toFile.exists()) toFile.createDirectories()
          } else {
            if (!toFile.parent.exists()) toFile.parent.createDirectories()
            Files.copy(zis, toFile, StandardCopyOption.REPLACE_EXISTING)
          }
        }
      }
    } catch (e: IOException) {
      logger.error("Error while unzipping GPT Runner executable", e)
    }
  }
}
