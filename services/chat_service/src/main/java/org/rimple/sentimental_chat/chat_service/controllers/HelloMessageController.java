package org.rimple.sentimental_chat.chat_service.controllers;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.SpanKind;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.Scope;
import io.opentelemetry.context.propagation.TextMapGetter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.rimple.sentimental_chat.chat_service.messages.incoming.HelloSpring;
import org.rimple.sentimental_chat.chat_service.messages.outgoing.HelloResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

import static org.rimple.sentimental_chat.chat_service.otel_utils.ContextUtils.GETTER;

@Controller
public class HelloMessageController {

  @Autowired
  private Tracer tracer;

  private static final Log log = LogFactory.getLog(HelloMessageController.class);

  @MessageMapping("/hello")
  @SendTo("/topic/hello")
  public HelloResponse sayHello(HelloSpring message, @Headers Map<String, Object> headers) {

    log.info("Headers: " + headers.toString());

    Context extractedContext = W3CTraceContextPropagator.getInstance().extract(Context.current(), headers, GETTER);
    log.info("Extracted context: " + extractedContext.toString());

    try (Scope scope = extractedContext.makeCurrent()) {
      // ✅ Create span inside extracted trace context
      Span span = tracer.spanBuilder("websocket-message-received")
          .setSpanKind(SpanKind.SERVER)
          .startSpan();

      log.info("Received message: " + message.toString());

      // actual work performed here
      HelloResponse returnValue = new HelloResponse("Hello, " + message.getName() + "!");

      span.end(); // ✅ Ensure span is ended within the correct context
      return returnValue;
    } catch (Exception e) {
      log.error("Error handling message", e);
      throw e;
    }
  }
}
