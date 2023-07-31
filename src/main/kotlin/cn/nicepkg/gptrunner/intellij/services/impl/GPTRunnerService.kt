package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.AbstractService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.openapi.components.service
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.project.Project
import kotlinx.coroutines.*
import java.io.File
import kotlin.concurrent.thread
import java.io.BufferedReader

// TODO: 需要提供几个action去启动/停止server
class GPTRunnerService(project: Project) : AbstractService(),
  IGPTRunnerService {

  private val executableService = service<IGPTRunnerExecutableService>()

  private var process: Process? = null
  private var inputFlowJob: Job? = null
  private var errorFlowJob: Job? = null

  private var _port = 3003
  override val port: Int
    get() = _port

  private val shutdownHook = thread(false) {
    runBlocking { closeNodeServer() }
  }

  init {
    println("oh!")
    Runtime.getRuntime().addShutdownHook(shutdownHook)
  }

  private var _isStarted = false

  @OptIn(ObsoleteCoroutinesApi::class)
  override suspend fun startNodeServer() {
    println("node start!")
    if (process?.isAlive == true || _isStarted) return
    //here we unzip or create.
    runBlocking {
      val nodePath = getNodePath();
      println("oh-nodePath: $nodePath")
      process = ProcessBuilder(
        nodePath,
        "start-server.cjs",
        "--port",
        port.toString(),
        "--client-dist-path",
        "browser"
      ).directory(executableService.gptRunnerExecutableDir.toFile())  // Update this line
        .start()
      _isStarted = true
      _isStarted = true

      inputFlowJob =
        launch(newSingleThreadContext("processInputFlowJob${process!!.pid()}")) {
          val inputReader = process?.inputReader()
          while (process?.isAlive == true && inputReader != null) {
            val line = inputReader.readLines()
            thisLogger().info("process input line:  $line")
          }
        }
      errorFlowJob =
        launch(newSingleThreadContext("processErrorFlowJob${process!!.pid()}")) {
          val errorReader = process?.errorReader()
          while (process?.isAlive == true && errorReader != null) {
            val line = errorReader.readLines()
            thisLogger().info("process input line:  $line")
          }
        }

      process!!.onExit().whenCompleteAsync { t, u ->
        val err = t.errorReader().readText()
        thisLogger().info("process exit value: ${t.exitValue()}")
        thisLogger().error(err, u)
        if (err.contains("address already in use")) {
          _port++
          runBlocking { startNodeServer() }
          return@whenCompleteAsync
        }
        runBlocking { closeNodeServer() }
      }
    }
  }

  override suspend fun closeNodeServer() {
    println("service close!")
    inputFlowJob?.cancel()
    errorFlowJob?.cancel()
    process?.destroyForcibly()
    _isStarted = false
  }

  override fun dispose() {
    Runtime.getRuntime().removeShutdownHook(shutdownHook)
    runBlocking { closeNodeServer() }
  }

  private fun getNodePath(): String? {
    return "/Users/houzi/.nvm/versions/node/v16.16.0/bin/node"
  }
//private fun getNodePath(): String? {
//  val process: Process
//  return try {
//    process = Runtime.getRuntime().exec("which node")
//    val reader = BufferedReader(InputStreamReader(process.inputStream))
//    reader.readLine()
//  } catch (e: Exception) {
//    e.printStackTrace()
//    null
//  }
//}

}
