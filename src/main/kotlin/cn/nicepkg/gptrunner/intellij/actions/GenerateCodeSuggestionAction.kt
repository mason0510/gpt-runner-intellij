package cn.nicepkg.gptrunner.intellij.actions

import cn.nicepkg.gptrunner.intellij.services.LangChainService
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.command.WriteCommandAction
import com.intellij.openapi.components.service
import com.intellij.openapi.editor.ScrollType
import com.intellij.openapi.util.TextRange
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class GenerateCodeSuggestionAction : AnAction("GPT:代码提示") {
    override fun actionPerformed(e: AnActionEvent) {
        val editor = e.getData(CommonDataKeys.EDITOR) ?: return
        val project = e.project ?: return

        val document = editor.document
        val offset = editor.caretModel.offset

        // 获取光标前的内容
        val textBeforeCursor = document.getText(TextRange(0, offset))
        // 获取光标后的内容
        val textAfterCursor = document.getText(TextRange(offset, document.textLength))

        // 构建上下文，用 "|" 标记光标位置
        val context = "$textBeforeCursor|$textAfterCursor"

        val langChainService = project.service<LangChainService>()

        CoroutineScope(Dispatchers.Default).launch {
            val suggestion = langChainService.getCodeSuggestion(context)
            val formattedSuggestion = langChainService.formatCode(suggestion)
            WriteCommandAction.runWriteCommandAction(project) {
                document.insertString(offset, formattedSuggestion)

                val newOffset = offset + formattedSuggestion.length
                editor.caretModel.moveToOffset(newOffset)
                editor.scrollingModel.scrollToCaret(ScrollType.MAKE_VISIBLE)

                val textToFormat = document.getText(TextRange(0, newOffset))
                val formattedText = langChainService.formatCode(textToFormat)
                document.replaceString(0, newOffset, formattedText)

                val finalOffset = formattedText.length
                val currentLine = document.getLineNumber(finalOffset)
                val lineStartOffset = document.getLineStartOffset(currentLine)
                val lineText = document.getText(TextRange(lineStartOffset, finalOffset))
                val indent = lineText.takeWhile { it.isWhitespace() }

                document.insertString(finalOffset, "\n$indent")
                editor.caretModel.moveToOffset(finalOffset + indent.length + 1)
                editor.scrollingModel.scrollToCaret(ScrollType.MAKE_VISIBLE)
            }
        }
    }
}
