package org.rimple.sentimental_chat.chat_service.messages.incoming;

public class HelloSpring extends MessageWithOtelHeaders {
  private String name;

  public HelloSpring(String name, String spanId, String traceId) {
    super(spanId, traceId);
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Override
  public String toString() {
    // TODO template this
    return "HelloSpring{" + "name='" + name + "\"}";
  }
}
