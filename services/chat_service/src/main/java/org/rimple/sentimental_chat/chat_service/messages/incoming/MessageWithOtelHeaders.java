package org.rimple.sentimental_chat.chat_service.messages.incoming;

public abstract class MessageWithOtelHeaders {
  private String spanId;

  private String traceId;

  public MessageWithOtelHeaders(String spanId, String traceId) {
    this.spanId = spanId;
    this.traceId = traceId;
  }

  public String getSpanId() {
    return spanId;
  }

  public String getTraceId() {
    return traceId;
  }
}
