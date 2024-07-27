package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.AbstractService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import org.apache.commons.lang3.SystemUtils
import java.io.File
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import kotlin.io.path.*

class GPTRunnerExecutableService : AbstractService(), IGPTRunnerExecutableService {
  override val userHome = SystemUtils.getUserHome().toPath()
  override val gptRunnerExecutablesDir = userHome.resolve(".gpt-runner")
  override val gptRunnerExecutableDir = gptRunnerExecutablesDir.resolve("GPT-Runner-${plugin.version}")

  init {
    if (gptRunnerExecutableDir.notExists() || gptRunnerExecutableDir.listDirectoryEntries().isEmpty()) {
      gptRunnerExecutableDir.createDirectories()
      unzipGPTRunnerExecutable()
    }
  }

  private fun unzipGPTRunnerExecutable() {
    javaClass.getResourceAsStream("/dist.zip")?.use { inputStream ->
      ZipInputStream(inputStream.buffered()).use { zis ->
        var entry: ZipEntry? = zis.nextEntry
        while (entry != null) {
          val name = entry.name.removePrefix("dist/")
          val toFile = gptRunnerExecutableDir.resolve(name).normalize()

          if (!toFile.startsWith(gptRunnerExecutableDir)) {
            throw SecurityException("Entry is outside of the target dir: ${entry.name}")
          }

          if (entry.isDirectory) {
            Files.createDirectories(toFile)
          } else {
            Files.createDirectories(toFile.parent)
            Files.copy(zis, toFile, StandardCopyOption.REPLACE_EXISTING)
          }

          entry = zis.nextEntry
        }
      }
    } ?: throw IllegalStateException("dist.zip not found in resources")
  }
}
