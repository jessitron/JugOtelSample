package org.rimple.sentimental_chat.chat_service.controllers;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.rimple.sentimental_chat.chat_service.messages.incoming.HelloSpring;
import org.rimple.sentimental_chat.chat_service.messages.outgoing.HelloResponse;
import static org.rimple.sentimental_chat.chat_service.otel_utils.ContextUtils.GETTER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.SpanKind;
import io.opentelemetry.api.trace.StatusCode;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.Scope;

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
      span.setAttribute("app.message-length", message.getName().length());
      span.setAttribute("app.message", sanitize(message.getName()));

      // Create an anagram of the input message
      String anagram = createAnagram(message.getName());
      HelloResponse returnValue = new HelloResponse(anagram);

      span.setAttribute("app.response-length", returnValue.getResponse().length());
      span.setAttribute("app.response", returnValue.getResponse());

      return returnValue;
    } catch (Exception e) {
      span.setStatus(StatusCode.ERROR, "Error handling message");
      span.recordException(e);
      throw e;
    } finally {
      span.end();
    }
  }

  private String sanitize(String str) {
    return (str.length() > 1000 ? str.substring(0, 1000) : str)
    .replaceAll("DataDog", "D****")
    .replaceAll("Honeycomb", "H********")
    .replaceAll("New Relic", "N********")
    .replaceAll("Splunk", "S*****")
    .replaceAll("honeycomb", "h********")
    .replaceAll("newrelic", "n********")
    .replaceAll("splunk", "s*****");
  }
}
