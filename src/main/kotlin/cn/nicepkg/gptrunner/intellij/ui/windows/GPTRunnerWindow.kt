package cn.nicepkg.gptrunner.intellij.ui.windows

import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.ide.ui.LafManagerListener
import com.intellij.ide.ui.laf.UIThemeBasedLookAndFeelInfo
import com.intellij.openapi.Disposable
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.service
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.project.Project
import com.intellij.ui.jcef.JBCefBrowser
import javax.swing.JComponent

class GPTRunnerWindow(project: Project, disposable: Disposable) {
  private val logger = Logger.getInstance(GPTRunnerWindow::class.java)

  private val jBCefBrowser: JBCefBrowser

  init {
    logger.info("Initializing GPTRunnerWindow")

    val port = project.service<IGPTRunnerService>().port
    val rootPath = project.basePath
    val url = "http://localhost:${port}/#/chat?rootPath=${rootPath}"
    
    logger.info("Constructing URL: $url")

    jBCefBrowser = JBCefBrowser(url).apply {
      logger.info("JBCefBrowser created")
    }

    ApplicationManager.getApplication().messageBus.connect(disposable)
      .subscribe(LafManagerListener.TOPIC, LafManagerListener {
        val isDark = (it.currentLookAndFeel as? UIThemeBasedLookAndFeelInfo)?.theme?.isDark ?: false
        logger.info("Theme changed. Is Dark: $isDark")
        updateTheme(isDark)
      })

    logger.info("GPTRunnerWindow initialized")
  }

  private fun updateTheme(isDark: Boolean) {
    val theme = if (isDark) "jetbrainsDark" else "jetbrainsLight"
    val script = "document.body.dataset.theme = '$theme'"
    logger.info("Updating theme. Script: $script")
    jBCefBrowser.cefBrowser.executeJavaScript(script, jBCefBrowser.cefBrowser.url, 0)
  }

  fun getContent(): JComponent {
    logger.info("Getting content")
    return jBCefBrowser.component
  }
}
