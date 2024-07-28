package cn.nicepkg.gptrunner.intellij.actions

import com.intellij.openapi.actionSystem.ActionUpdateThread
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.ui.Messages

class OpenInEditorMode : AnAction() {
  companion object {
    init {
      thisLogger().warn("OpenInEditorMode class loaded")
    }
  }

  private val logger = thisLogger()

  override fun actionPerformed(e: AnActionEvent) {
    logger.warn("OpenInEditorMode action performed")

    if (e.project == null) {
      logger.warn("Project is null, action not performed")
      return
    }

    val project = e.project!!
    logger.warn("Action performed for project: ${project.name}")

    // Show a message dialog for debugging
    Messages.showInfoMessage(project, "OpenInEditorMode action triggered", "Debug Info")

    // TODO: Implement your action logic here
  }

  override fun update(e: AnActionEvent) {
    val isEnabled = e.project != null
    logger.warn("OpenInEditorMode update called, isEnabled: $isEnabled")
    e.presentation.isEnabled = isEnabled
    super.update(e)
  }

  override fun getActionUpdateThread(): ActionUpdateThread {
    logger.warn("getActionUpdateThread called")
    return ActionUpdateThread.EDT
  }
}
