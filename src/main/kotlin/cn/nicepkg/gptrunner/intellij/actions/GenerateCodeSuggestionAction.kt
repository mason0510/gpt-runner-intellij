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
import com.intellij.openapi.diagnostic.Logger
import cn.nicepkg.gptrunner.intellij.debounce.SmartDebouncer
import cn.nicepkg.gptrunner.intellij.debounce.ContextualScoreCalculator
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay


class GenerateCodeSuggestionAction : AnAction("GPT:代码提示") {
    companion object {
        init {
            Logger.getInstance(javaClass).warn("GenerateCodeSuggestionAction class loaded")
        }
    }
    private val logger = Logger.getInstance(GenerateCodeSuggestionAction::class.java)
    private val smartDebouncer = SmartDebouncer(ContextualScoreCalculator())
    private var debouncedJob: Job? = null

    override fun actionPerformed(e: AnActionEvent) {
        val editor = e.getData(CommonDataKeys.EDITOR) ?: return
        val project = e.project ?: return

        val document = editor.document
        val offset = editor.caretModel.offset

        logger.info("GenerateCodeSuggestionAction is triggered")

        val textBeforeCursor = document.getText(TextRange(0, offset))
        val textAfterCursor = document.getText(TextRange(offset, document.textLength))
        val context = "$textBeforeCursor|$textAfterCursor"

        val langChainService = project.service<LangChainService>()

        debouncedJob?.cancel()
        debouncedJob = CoroutineScope(Dispatchers.Default).launch {
            val debounceTime = smartDebouncer.getDebounceTime(context)
            delay(debounceTime)

            val suggestion = langChainService.getCodeSuggestion(context)
            logger.info("Code suggestion received: ${suggestion.take(50)}...")
            logger.info(suggestion)

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
