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

repositories {
  mavenCentral()
}

dependencies {
  implementation(libs.coroutines)
  implementation(kotlin("script-runtime"))
  testImplementation(kotlin("script-runtime"))
  testImplementation(kotlin("test"))
}

java {
  sourceCompatibility = JavaVersion.VERSION_11
  targetCompatibility = JavaVersion.VERSION_11
}

kotlin {
  jvmToolchain(11)
}

intellij {
  pluginName = properties("pluginName").get()
  version = "2021.3.3"
  type = properties("platformType").get()

  plugins = properties("platformPlugins").map {
    it.split(',').map(String::trim).filter(String::isNotEmpty)
  }.orElse(emptyList())
}

changelog {
  groups.empty()
  repositoryUrl = properties("pluginRepositoryUrl")
}

qodana {
  cachePath = provider { file(".qodana").canonicalPath }
  reportPath = provider { file("build/reports/inspections").canonicalPath }
  saveReport = true
  showReport = environment("QODANA_SHOW_REPORT").map { it.toBoolean() }.getOrElse(false)
}

koverReport {
  defaults {
    xml {
      onCheck = true
    }
  }
}

node {
  download = false
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

    changeNotes.set(provider {
      changelog.getLatest().toHTML()
    })
  }

  runIde {
    autoReloadPlugins.set(true)
  }

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
}
