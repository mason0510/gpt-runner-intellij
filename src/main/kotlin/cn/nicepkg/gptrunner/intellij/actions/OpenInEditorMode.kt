package cn.nicepkg.gptrunner.intellij.actions

import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindowManager

class OpenInEditorMode : AnAction() {
  override fun actionPerformed(e: AnActionEvent) {
    if (e.project == null) return
//    val project = e.project!!
//    val gptRunnerService = project.service<IGPTRunnerService>()
//    project.projectFile
  }

  override fun update(e: AnActionEvent) {
    e.presentation.isEnabled = e.project != null
    super.update(e)
  }

}
