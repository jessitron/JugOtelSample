package org.rimple.sentimental_chat.chat_service;

import io.opentelemetry.api.trace.SpanKind;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.propagation.TextMapGetter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import io.opentelemetry.api.trace.Span;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.Map;


@Configuration
@EnableWebSocketMessageBroker
public class ChatWebSocketConfig implements WebSocketMessageBrokerConfigurer {
  @Autowired
  private Tracer tracer;

  protected final Log logger = LogFactory.getLog(this.getClass());

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/topic");
    config.setApplicationDestinationPrefixes("/app");
  }
  private static final TextMapGetter<Map<String, Object>> GETTER = new TextMapGetter<>() {
    @Override
    public Iterable<String> keys(Map<String, Object> carrier) {
      return carrier.keySet();
    }

    @Override
    public String get(Map<String, Object> carrier, String key) {
      if (carrier == null) return null;
      Object value = carrier.get(key);
      return (value instanceof String) ? (String) value : null; // ✅ Ensure it's a String
    }
  };

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry
        .addEndpoint("/gs-guide-websocket")
        .addInterceptors(new HandshakeInterceptor() {
          @Override
          public boolean beforeHandshake(@NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response, 
              @NonNull WebSocketHandler wsHandler, @NonNull Map<String, Object> headers) throws Exception {
            Context extractedContext = W3CTraceContextPropagator
                .getInstance()
                .extract(Context.current(), headers, GETTER);

            logger.info("Extracted context: " + extractedContext.toString());
//            logger.info("WebSocket handshake started");
//            var traceparent = request.getHeaders().get("traceparent");
//            if (traceparent == null) {
//              logger.info("No traceparent header found");
//              return true;
//            }

            Span span = tracer.spanBuilder("websocket-handshake")
                .setSpanKind(SpanKind.SERVER) // Server-side span
                .setParent(extractedContext)
                .setAttribute("http.url", request.getURI().toString())
                .setAttribute("websocket.origin", request.getHeaders().getOrigin())
                .startSpan();
            request.getAttributes().put("otelSpan", span); // Store in session attributes
            return true;
          }

          @Override
          public void afterHandshake(@NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response,
              @NonNull WebSocketHandler wsHandler, @Nullable Exception exception) {
            logger.info("WebSocket handshake completed");
            Span span = (Span) request.getAttributes().get("otelSpan");
            if (span != null) {
              span.end();
            }
          }
        })
        .setAllowedOrigins("*");

  }
}
