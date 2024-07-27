package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.AbstractService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.notification.NotificationDisplayType
import com.intellij.notification.NotificationGroup
import com.intellij.openapi.components.service
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.project.Project
import kotlinx.coroutines.*
import java.io.File
import kotlin.concurrent.thread

class GPTRunnerService(project: Project) : AbstractService(), IGPTRunnerService {

    private val executableService = service<IGPTRunnerExecutableService>()

    private var process: Process? = null
    private var inputFlowJob: Job? = null
    private var errorFlowJob: Job? = null

    private var _port = 13000
    override val port: Int
        get() = _port

    private val shutdownHook = thread(false) {
        runBlocking { closeNodeServer() }
    }

    init {
        Runtime.getRuntime().addShutdownHook(shutdownHook)
    }

    private var _isStarted = false

    @OptIn(ObsoleteCoroutinesApi::class)
    override suspend fun startNodeServer() {
        if (process?.isAlive == true || _isStarted) return

        runBlocking {
            val nodePath = getMyNodePath()
            if (nodePath.isNullOrEmpty()) {
                thisLogger().error("Node.js path not found")
            } else {
                process = ProcessBuilder(
                    nodePath,
                    "start-server.cjs",
                    "--port",
                    port.toString(),
                    "--client-dist-path",
                    "browser"
                ).directory(executableService.gptRunnerExecutableDir.toFile())
                    .start()
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
    }

    override suspend fun closeNodeServer() {
        inputFlowJob?.cancel()
        errorFlowJob?.cancel()
        process?.destroyForcibly()
        _isStarted = false
    }

    override fun dispose() {
        Runtime.getRuntime().removeShutdownHook(shutdownHook)
        runBlocking { closeNodeServer() }
    }

    fun getMyNodePath(): String {
        val nodeHome = System.getenv("NODE_HOME")
        if (!nodeHome.isNullOrEmpty()) {
            val nodePath = "$nodeHome/bin/node"
            if (File(nodePath).exists()) {
                return nodePath
            }
        }

        val osName = System.getProperty("os.name").toLowerCase()
        return when {
            osName.contains("mac") || osName.contains("nix") || osName.contains("nux") -> "/usr/local/bin/node"
            osName.contains("win") -> "C:/Program Files/nodejs/node.exe"
            else -> throw UnsupportedOperationException("Unsupported OS: $osName")
        }
    }

    // 在插件初始化或类中创建通知组
    private val NOTIFICATION_GROUP = NotificationGroup(
        "NodeJSNotFound",
        NotificationDisplayType.BALLOON,
        true
    )
}
