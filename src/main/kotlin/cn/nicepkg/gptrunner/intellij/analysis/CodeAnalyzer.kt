package cn.nicepkg.gptrunner.intellij.analysis

class CodeAnalyzer {
    fun analyzeContext(context: String): Map<String, Any> {
        val variables = extractVariables(context)
        val functions = extractFunctions(context)
        return mapOf(
            "variables" to variables,
            "functions" to functions
        )
    }

    private fun extractVariables(context: String): List<String> {
        // 简单的变量提取逻辑，可以根据需要扩展
        val variableRegex = Regex("(val|var)\\s+(\\w+)")
        return variableRegex.findAll(context).map { it.groupValues[2] }.toList()
    }

    private fun extractFunctions(context: String): List<String> {
        // 简单的函数提取逻辑，可以根据需要扩展
        val functionRegex = Regex("fun\\s+(\\w+)")
        return functionRegex.findAll(context).map { it.groupValues[1] }.toList()
    }
}
