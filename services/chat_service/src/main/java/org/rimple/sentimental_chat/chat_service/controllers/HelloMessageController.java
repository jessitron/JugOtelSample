package org.rimple.sentimental_chat.chat_service.controllers;

import org.rimple.sentimental_chat.chat_service.messages.incoming.HelloSpring;
import org.rimple.sentimental_chat.chat_service.messages.outgoing.HelloResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class HelloMessageController {

  @MessageMapping("/hello")
  @SendTo("/topic/hello")
  public HelloResponse sayHello(HelloSpring message) {
    return new HelloResponse("Hello, " + message.getName() + "!");
  }
}
