package cn.nicepkg.gptrunner.intellij.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.DefaultActionGroup

class ConvertCodeAction : DefaultActionGroup("GPT:代码转换", true) {
    init {
        addAction(ConvertToGoAction())
        addAction(ConvertToRustAction())
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabledAndVisible = true
    }
}
