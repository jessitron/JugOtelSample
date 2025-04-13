// File: build.gradle.kts

plugins {
  id("org.springframework.boot") version "3.2.3"
  id("io.spring.dependency-management") version "1.1.4"
  java
}

repositories {
  mavenCentral()
}

group = "org.rimple.ecommerce"
version = "0.0.1-SNAPSHOT"
description = "Ecommerce backend service for product catalog, cart, and orders"

java {
  toolchain {
    languageVersion.set(JavaLanguageVersion.of(21))
  }
}

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-websocket")
  implementation("org.springframework.boot:spring-boot-starter-aop")
  
  implementation("io.opentelemetry:opentelemetry-api:1.43.0")
  implementation("io.opentelemetry:opentelemetry-context:1.43.0")

  runtimeOnly("org.postgresql:postgresql")

  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("com.h2database:h2:2.3.232")
}

tasks.withType<Test> {
  useJUnitPlatform()
}

// Optional: for OTEL agent
val otelAgentPath = project.findProperty("otel.agent.path")?.toString()

if (otelAgentPath != null) {
  tasks.named<JavaExec>("bootRun") {
    jvmArgs = listOf("-javaagent:$otelAgentPath")
  }
}
