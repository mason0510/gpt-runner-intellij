package cn.nicepkg.gptrunner.intellij.actions

import cn.nicepkg.gptrunner.intellij.services.LangChainService
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.command.WriteCommandAction
import com.intellij.openapi.components.service
import com.intellij.openapi.editor.ScrollType
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

abstract class BaseConvertAction(private val targetLanguage: String) : AnAction("转换为 $targetLanguage") {
    override fun actionPerformed(e: AnActionEvent) {
        val editor = e.getData(CommonDataKeys.EDITOR) ?: return
        val project = e.project ?: return

        val document = editor.document
        val selectionModel = editor.selectionModel

        val selectedText = if (selectionModel.hasSelection()) {
            selectionModel.selectedText
        } else {
            document.text
        } ?: return

        println("选择的目标语言: $targetLanguage")
        println("要转换的代码:\n$selectedText")

        val langChainService = project.service<LangChainService>()

        CoroutineScope(Dispatchers.Default).launch {
            val convertedCode = langChainService.convertCode(selectedText, targetLanguage)

            WriteCommandAction.runWriteCommandAction(project) {
                if (selectionModel.hasSelection()) {
                    document.replaceString(selectionModel.selectionStart, selectionModel.selectionEnd, convertedCode)
                } else {
                    document.setText(convertedCode)
                }

                editor.caretModel.moveToOffset(document.textLength)
                editor.scrollingModel.scrollToCaret(ScrollType.MAKE_VISIBLE)
            }

            println("转换后的代码:\n$convertedCode")
        }
    }
}

class ConvertToGoAction : BaseConvertAction("Go")
class ConvertToRustAction : BaseConvertAction("Rust")
