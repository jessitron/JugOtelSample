package org.rimple.sentimental_chat.chat_service.messages.incoming;

public class HelloSpring {
  private String name;

  public HelloSpring(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
