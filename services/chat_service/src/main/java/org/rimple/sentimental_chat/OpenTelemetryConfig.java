package org.rimple.sentimental_chat;

import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.trace.Tracer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenTelemetryConfig {
  @Bean
  public OpenTelemetry openTelemetry() {
    // ✅ Use the OpenTelemetry instance from the agent
    return GlobalOpenTelemetry.get();
  }

  @Bean
  public Tracer tracer(OpenTelemetry openTelemetry) {
    // ✅ Retrieve the tracer from the globally initialized OpenTelemetry SDK
    return openTelemetry.getTracer("chat-service");
  }
}
