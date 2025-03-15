package org.rimple.sentimental_chat.chat_service.messages.outgoing;

public class HelloResponse {
  private String response;

  public String getResponse() {
    return response;
  }

  public void setResponse(String response) {
    this.response = response;
  }

  public HelloResponse(String response) {
    this.response = response;
  }
}
