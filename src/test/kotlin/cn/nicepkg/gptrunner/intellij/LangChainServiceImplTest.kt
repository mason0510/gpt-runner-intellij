//package cn.nicepkg.gptrunner.intellij.services.impl
//
//import kotlinx.coroutines.runBlocking
//import org.junit.jupiter.api.BeforeEach
//import org.junit.jupiter.api.Test
//import org.junit.jupiter.api.Assertions.*
//
//class LangChainServiceImplIntegrationTest {
//
//    private lateinit var langChainService: LangChainServiceImpl
//
//    @BeforeEach
//    fun setup() {
//        // 如果需要，在这里设置环境变量
//        // System.setProperty("OPENAI_API_KEY", "你的实际API密钥")
//        // System.setProperty("OPENAI_API_BASE", "https://api.openai.com/")
//        // System.setProperty("OPENAI_MODEL_NAME", "gpt-3.5-turbo")
//
////        langChainService = LangChainServiceImpl()
//    }
//
//    @Test
//    fun testGetCodeSuggestion() = runBlocking {
//        val context = "public class HelloWorld { }"
//
//        println("Starting real API call with context: $context")
//
//        val result = langChainService.getCodeSuggestion(context)
//
//        println("API call result: $result")
//
//        assertNotNull(result)
//        assertTrue(result.isNotBlank())
//        // 可以添加更多具体的断言，比如检查结果是否包含某些预期的关键词
//    }
//}
