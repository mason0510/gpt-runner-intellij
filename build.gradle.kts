import com.github.gradle.node.pnpm.task.PnpmTask
import com.github.gradle.node.task.NodeTask
import org.jetbrains.changelog.Changelog
import org.jetbrains.changelog.markdownToHTML
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

fun properties(key: String) = providers.gradleProperty(key)
fun environment(key: String) = providers.environmentVariable(key)

plugins {
  id("java") // Java support
  alias(libs.plugins.kotlin) // Kotlin support
  alias(libs.plugins.gradleIntelliJPlugin) // Gradle IntelliJ Plugin
  alias(libs.plugins.changelog) // Gradle Changelog Plugin
  alias(libs.plugins.qodana) // Gradle Qodana Plugin
  alias(libs.plugins.kover) // Gradle Kover Plugin
  alias(libs.plugins.nodeGradle) // Gradle Node Plugin
//  id("org.jetbrains.intellij") version "1.13.3" // 使用兼容的版本

}

group = properties("pluginGroup").get()
version = properties("pluginVersion").get()

// Configure project's dependencies
repositories {
  mavenCentral()
}


// Dependencies are managed with Gradle version catalog - read more: https://docs.gradle.org/current/userguide/platforms.html#sub:version-catalog
dependencies {
//    implementation(libs.annotations)
  implementation(libs.coroutines)
  implementation(kotlin("script-runtime"))
  testImplementation(kotlin("script-runtime"))
  testImplementation(kotlin("test"))
  implementation("dev.langchain4j:langchain4j-open-ai:0.33.0")
  implementation("dev.langchain4j:langchain4j:0.33.0")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
  testImplementation("org.junit.jupiter:junit-jupiter-api:5.8.2")
  testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.8.2")

  // Mockito
  testImplementation("org.mockito:mockito-core:4.5.1")
  testImplementation("org.mockito.kotlin:mockito-kotlin:4.0.0")

  // Kotlin Coroutines Test
  testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.6.4")



}

// Set the JVM language level used to build the project. Use Java 11 for 2020.3+, and Java 17 for 2022.2+.
java {
  sourceCompatibility = JavaVersion.VERSION_17
  targetCompatibility = JavaVersion.VERSION_17
}

kotlin {
  jvmToolchain(17)
}


// Configure Gradle IntelliJ Plugin - read more: https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html
intellij {
  pluginName = properties("pluginName").get()
  version = properties("platformVersion").get()
// Configure
  type = properties("platformType").get()

  // Plugin Dependencies. Uses `platformPlugins` property from the gradle.properties file.
  plugins = properties("platformPlugins").map {
    it.split(',').map(String::trim).filter(String::isNotEmpty)
  }.orElse(emptyList())

}


// Configure Gradle Changelog Plugin - read more: https://github.com/JetBrains/gradle-changelog-plugin
changelog {
  groups.empty()
  repositoryUrl = properties("pluginRepositoryUrl")
}

// Configure Gradle Qodana Plugin - read more: https://github.com/JetBrains/gradle-qodana-plugin
qodana {
  cachePath = provider { file(".qodana").canonicalPath }
  reportPath = provider { file("build/reports/inspections").canonicalPath }
  saveReport = true
  showReport =
    environment("QODANA_SHOW_REPORT").map { it.toBoolean() }.getOrElse(false)
}

// Configure Gradle Kover Plugin - read more: https://github.com/Kotlin/kotlinx-kover#configuration
koverReport {
  defaults {
    xml {
      onCheck = true
    }
  }
}

tasks.test {
  useJUnitPlatform()
  testLogging {
    events("passed", "skipped", "failed", "standardOut", "standardError")
    showStandardStreams = true
  }
}


node {
  // If you don't have node installed on your computer, change it to `true`, but please be careful not to commit to git
  download = false
  // If `download` is true, `version` available.
  // version = "20"

//  nodeProjectDir.set(File("../gpt-runner-web"))
//  workDir.set(File("../gpt-runner-web"))

  nodeProjectDir.set(File("./"))
  workDir.set(File("./"))
}

val buildGPTRunnerWebClientTask = tasks.register("buildGPTRunnerWebClient", PnpmTask::class) {
  dependsOn(tasks.pnpmInstall)
  pnpmCommand.set(listOf("build:client:watch"))
}

val runGPTRunnerServerTask = tasks.register("runGPTRunnerServerTask", NodeTask::class) {
  dependsOn(tasks.pnpmInstall)
  script.set(File("../gpt-runner-web/dist/start-server.cjs"))
}

tasks.withType<JavaCompile>().configureEach {
  options.isIncremental = true
}

tasks {
  wrapper {
    gradleVersion = properties("gradleVersion").get()
  }

  patchPluginXml {
    version.set(properties("pluginVersion"))
    sinceBuild.set(properties("pluginSinceBuild"))
    untilBuild.set(properties("pluginUntilBuild"))

    pluginDescription.set("""
            GPT-Runner: AI-powered coding assistant for your IDE.
            Enhance productivity with intelligent suggestions and seamless integration.
            Features include code generation, documentation assistance, and more.
            Streamline your workflow and boost your coding efficiency with GPT-Runner.
            This plugin integrates advanced language models directly into your development environment,
            providing real-time coding assistance, automated documentation, and intelligent code analysis.
        """.trimIndent())

//    changeNotes.set(provider {
//      changelog.getLatest()
//    })
  }


  runIde {
    autoReloadPlugins.set(true) // 如果你不希望插件在IDE运行期间自动重新加载，则可以将此设置为false
  }

  // Configure UI tests plugin
  // Read more: https://github.com/JetBrains/intellij-ui-test-robot
  runIdeForUiTests {
    systemProperty("robot-server.port", "8082")
    systemProperty("ide.mac.message.dialogs.as.sheets", "false")
    systemProperty("jb.privacy.policy.text", "<!--999.999-->")
    systemProperty("jb.consents.confirmation.enabled", "false")
  }

  signPlugin {
    certificateChain = environment("CERTIFICATE_CHAIN")
    privateKey = environment("PRIVATE_KEY")
    password = environment("PRIVATE_KEY_PASSWORD")
  }


  jar {
    from("dist") {
      into("resource")
    }
  }
//  jar {
//      exclude("dist/**")
//  }

}
