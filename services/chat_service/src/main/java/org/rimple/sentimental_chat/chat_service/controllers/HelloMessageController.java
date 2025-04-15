package org.rimple.sentimental_chat.chat_service.controllers;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.SpanKind;
import io.opentelemetry.api.trace.StatusCode;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.Scope;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.rimple.sentimental_chat.chat_service.messages.incoming.HelloSpring;
import org.rimple.sentimental_chat.chat_service.messages.outgoing.HelloResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.rimple.sentimental_chat.chat_service.otel_utils.ContextUtils.GETTER;

@Controller
public class HelloMessageController {

  @Autowired
  private Tracer tracer;

  private static final Log log = LogFactory.getLog(HelloMessageController.class);

  private String createAnagram(String input) {
    List<Character> chars = input.chars()
        .mapToObj(c -> (char) c)
        .collect(Collectors.toList());
    Collections.shuffle(chars);
    return chars.stream()
        .map(String::valueOf)
        .collect(Collectors.joining());
  }

  @MessageMapping("/hello")
  @SendTo("/topic/hello")
  public HelloResponse sayHello(HelloSpring message, @Headers Map<String, Object> headers) {
    log.info("Headers: " + headers.toString());

    Context extractedContext = W3CTraceContextPropagator.getInstance().extract(Context.current(), headers, GETTER);
    log.info("Extracted context: " + extractedContext.toString());

    Span span = tracer.spanBuilder("websocket-message-received")
              .setSpanKind(SpanKind.SERVER)
              .startSpan();

    try (Scope scope = extractedContext.makeCurrent()) {
      span.setAttribute("app.extracted-context", extractedContext.toString());
      span.setAttribute("app.message-length", message.toString().length());

      // Create an anagram of the input message
      String anagram = createAnagram(message.getName());
      HelloResponse returnValue = new HelloResponse(anagram);

      span.setAttribute("app.response-length", returnValue.toString().length());

      return returnValue;
    } catch (Exception e) {
      span.setStatus(StatusCode.ERROR, "Error handling message");
      span.recordException(e);
      throw e;
    } finally {
      span.end();
    }
  }
}
