package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.AbstractService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.notification.NotificationGroup
import com.intellij.notification.NotificationGroupManager
import com.intellij.notification.NotificationType
import com.intellij.openapi.components.service
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.project.Project
import kotlinx.coroutines.*
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import kotlin.concurrent.thread

class GPTRunnerService(project: Project) : AbstractService(), IGPTRunnerService {
    private val logger = Logger.getInstance(GPTRunnerService::class.java)
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
        logger.info("GPTRunnerService initialized for project: ${project.name}")
        Runtime.getRuntime().addShutdownHook(shutdownHook)
    }

    private var _isStarted = false

    @OptIn(ObsoleteCoroutinesApi::class)
    override suspend fun startNodeServer() {
        logger.info("Attempting to start Node server")
        if (process?.isAlive == true || _isStarted) {
            logger.info("Node server is already running")
            return
        }

        runBlocking {
            val nodePath = getMyNodePath()
            if (nodePath.isNullOrEmpty()) {
                logger.error("Node.js path not found. Please ensure Node.js is installed and its path is set correctly.")
                NOTIFICATION_GROUP.createNotification(
                    "Node.js Not Found",
                    "Please ensure Node.js is installed and its path is set correctly.",
                    NotificationType.ERROR
                ).notify(null)
            } else {
                logger.info("Using Node.js path: $nodePath")
                try {
                    val executableDir = executableService.gptRunnerExecutableDir.toFile()
                    logger.info("Executable directory: ${executableDir.absolutePath}")

                    val startServerPath = File(executableDir, "start-server.cjs").absolutePath
                    logger.info("Start server script path: $startServerPath")

                    if (!File(startServerPath).exists()) {
                        logger.error("start-server.cjs not found at $startServerPath")
                        return@runBlocking
                    }

                    val processBuilder = ProcessBuilder(
                        nodePath,
                        startServerPath,
                        "--port",
                        port.toString(),
                        "--client-dist-path",
                        "browser"  // 修改这里，直接使用 "browser" 目录
                    ).directory(executableDir)

                    logger.info("Starting process with command: ${processBuilder.command().joinToString(" ")}")

                    process = processBuilder.start()
                    _isStarted = true
                    logger.info("Node server process started")

                    inputFlowJob = launch(newSingleThreadContext("processInputFlowJob${process!!.pid()}")) {
                        val inputReader = BufferedReader(InputStreamReader(process?.inputStream))
                        while (process?.isAlive == true) {
                            val line = inputReader.readLine()
                            if (line != null) {
                                logger.info("Node server output: $line")
                            } else {
                                break
                            }
                        }
                    }
                    errorFlowJob = launch(newSingleThreadContext("processErrorFlowJob${process!!.pid()}")) {
                        val errorReader = BufferedReader(InputStreamReader(process?.errorStream))
                        while (process?.isAlive == true) {
                            val line = errorReader.readLine()
                            if (line != null) {
                                logger.error("Node server error: $line")
                            } else {
                                break
                            }
                        }
                    }

                    process!!.onExit().whenComplete { t, u ->
                        val exitValue = t.exitValue()
                        logger.info("Node server process exited with value: $exitValue")
                        if (exitValue != 0) {
                            val err = BufferedReader(InputStreamReader(t.errorStream)).readText()
                            logger.error("Node server error output: $err")
                            if (err.contains("address already in use")) {
                                _port++
                                logger.info("Port already in use, incrementing to $_port")
                                runBlocking { startNodeServer() }
                            } else {
                                runBlocking { closeNodeServer() }
                            }
                        }
                    }
                } catch (e: Exception) {
                    logger.error("Failed to start Node.js server", e)
                }
            }
        }
    }

    override suspend fun closeNodeServer() {
        logger.info("Closing Node server")
        inputFlowJob?.cancel()
        errorFlowJob?.cancel()
        process?.destroyForcibly()
        _isStarted = false
        logger.info("Node server closed")
    }

    override fun dispose() {
        logger.info("Disposing GPTRunnerService")
        Runtime.getRuntime().removeShutdownHook(shutdownHook)
        runBlocking { closeNodeServer() }
        logger.info("GPTRunnerService disposed")
    }

    private fun getMyNodePath(): String? {
        logger.info("Attempting to find Node.js path")
        val nodeHome = System.getenv("NODE_HOME")
        if (!nodeHome.isNullOrEmpty()) {
            val nodePath = "$nodeHome/bin/node"
            logger.info("Checking NODE_HOME path: $nodePath")
            if (File(nodePath).exists()) {
                logger.info("Node.js found at NODE_HOME: $nodePath")
                return nodePath
            }
        }

        val osName = System.getProperty("os.name").toLowerCase()
        logger.info("Operating System: $osName")
        val defaultPath = when {
            osName.contains("mac") -> "/usr/local/bin/node"
            osName.contains("nix") || osName.contains("nux") -> "/usr/bin/node"
            osName.contains("win") -> "C:/Program Files/nodejs/node.exe"
            else -> null
        }

        return if (defaultPath != null && File(defaultPath).exists()) {
            logger.info("Node.js found at default path: $defaultPath")
            defaultPath
        } else {
            logger.info("Node.js not found at default path, searching in PATH")
            val pathEnv = System.getenv("PATH")
            val nodePath = pathEnv.split(File.pathSeparator)
                .map { File(it, "node").absolutePath }
                .find { File(it).exists() }
            if (nodePath != null) {
                logger.info("Node.js found in PATH: $nodePath")
            } else {
                logger.error("Node.js not found in PATH")
            }
            nodePath
        }
    }

    companion object {
        private const val NOTIFICATION_GROUP_ID = "NodeJSNotFound"

        val NOTIFICATION_GROUP: NotificationGroup by lazy {
            NotificationGroupManager.getInstance().getNotificationGroup(NOTIFICATION_GROUP_ID)
                ?: NotificationGroup.balloonGroup(NOTIFICATION_GROUP_ID)
        }
    }
}
