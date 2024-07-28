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
            val formattedSuggestion = langChainService.formatCode(suggestion)
            WriteCommandAction.runWriteCommandAction(project) {
                document.insertString(offset, formattedSuggestion)

                // 计算新的光标位置
                val newOffset = offset + formattedSuggestion.length

                // 移动光标到插入的代码末尾
                editor.caretModel.moveToOffset(newOffset)

                // 确保光标可见
                editor.scrollingModel.scrollToCaret(ScrollType.MAKE_VISIBLE)

                // 获取从文件开始到新插入代码末尾的所有内容
                val textToFormat = document.getText().substring(0, newOffset)

                // 格式化代码
                val formattedText = langChainService.formatCode(textToFormat)

                // 替换原文本为格式化后的文本
                document.replaceString(0, newOffset, formattedText)

                // 重新设置光标位置到格式化后的文本末尾
                val finalOffset = formattedText.length

                // 获取当前行的缩进
                val currentLine = document.getLineNumber(finalOffset)
                val lineStartOffset = document.getLineStartOffset(currentLine)
                val lineText = document.getText(TextRange(lineStartOffset, finalOffset))
                val indent = lineText.takeWhile { it.isWhitespace() }

                // 移动到下一行并应用相同的缩进
                document.insertString(finalOffset, "\n$indent")
                editor.caretModel.moveToOffset(finalOffset + indent.length + 1)

                editor.scrollingModel.scrollToCaret(ScrollType.MAKE_VISIBLE)
            }
        }
    }
}
