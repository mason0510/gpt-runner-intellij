package cn.nicepkg.gptrunner.intellij.actions

import cn.nicepkg.gptrunner.intellij.services.LangChainService
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.command.WriteCommandAction
import com.intellij.openapi.components.service
import com.intellij.psi.PsiDocumentManager
import com.intellij.psi.codeStyle.CodeStyleManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class GenerateCodeSuggestionAction : AnAction("Generate Code Suggestion") {
    override fun actionPerformed(e: AnActionEvent) {
        val editor = e.getData(CommonDataKeys.EDITOR) ?: return
        val project = e.project ?: return

        val document = editor.document
        val offset = editor.caretModel.offset

        val currentLineNumber = document.getLineNumber(offset) + 1
        val previousCode = document.getText().substring(0, document.getLineStartOffset(currentLineNumber - 1))

        val context = """
            $previousCode
        """.trimIndent()

        val langChainService = project.service<LangChainService>()

        CoroutineScope(Dispatchers.Default).launch {
            val suggestion = langChainService.getCodeSuggestion(context)
            WriteCommandAction.runWriteCommandAction(project) {
                document.insertString(offset, suggestion)

                // 获取插入代码后的 PsiFile
                val psiFile = PsiDocumentManager.getInstance(project).getPsiFile(document)
                if (psiFile != null) {
                    // 格式化整个文件
                    CodeStyleManager.getInstance(project).reformat(psiFile)
                }
            }
        }
    }
}
