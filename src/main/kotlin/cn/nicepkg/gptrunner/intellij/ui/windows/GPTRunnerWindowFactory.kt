package cn.nicepkg.gptrunner.intellij.ui.windows

import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.content.ContentFactory
import com.intellij.openapi.diagnostic.thisLogger

class GPTRunnerWindowFactory : ToolWindowFactory {

  init {
    thisLogger().info("GPTRunnerWindowFactory init.")
  }

  override fun createToolWindowContent(project: Project, window: ToolWindow) {
    val gptRunnerWindow = GPTRunnerWindow(project, window.disposable)
    val content = ContentFactory.SERVICE.getInstance().createContent(
      gptRunnerWindow.getContent(), null, true
    )
    window.contentManager.addContent(content)
  }

  override fun shouldBeAvailable(project: Project) = true
}
