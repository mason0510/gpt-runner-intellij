package cn.nicepkg.gptrunner.intellij.ui.windows

import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.ide.ui.LafManagerListener
import com.intellij.ide.ui.laf.UIThemeBasedLookAndFeelInfo
import com.intellij.openapi.Disposable
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import com.intellij.ui.jcef.JBCefBrowser

class GPTRunnerWindow(project: Project, disposable: Disposable) {
  private val jBCefBrowser = JBCefBrowser("http://localhost:${project.service<IGPTRunnerService>().port}/#/chat?rootPath=${project.basePath}").apply {}

  init {
    ApplicationManager.getApplication().messageBus.connect(disposable)
      .subscribe(LafManagerListener.TOPIC, LafManagerListener {
        val isDark = (it.currentLookAndFeel as? UIThemeBasedLookAndFeelInfo)?.theme?.isDark ?: false
        updateTheme(isDark)
      })
  }

  private fun updateTheme(isDark: Boolean) {
    val script = "document.body.dataset.theme = '${if (isDark) "jetbrainsDark" else "jetbrainsLight"}'"
    jBCefBrowser.cefBrowser.executeJavaScript(script, jBCefBrowser.cefBrowser.url, 0)
  }

  fun getContent() = jBCefBrowser.component
}
