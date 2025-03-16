package org.rimple.sentimental_chat.chat_service.otel_utils;

import io.opentelemetry.context.propagation.TextMapGetter;

import java.util.List;
import java.util.Map;

public class ContextUtils {
  public static final TextMapGetter<Map<String, Object>> GETTER = new TextMapGetter<>() {
    @Override
    public Iterable<String> keys(Map<String, Object> carrier) {
      return carrier.keySet();
    }

    @Override
    public String get(Map<String, Object> carrier, String key) {
      if (carrier == null) return null;

      // ✅ Check `nativeHeaders` map for traceparent
      Object nativeHeaders = carrier.get("nativeHeaders");
      if (nativeHeaders instanceof Map) {
        Object traceHeaderValue = ((Map<?, ?>) nativeHeaders).get(key);
        if (traceHeaderValue instanceof List<?> list && !list.isEmpty()) {
          return list.get(0).toString();  // ✅ Extract first value from list
        }
      }

      // ✅ Fall back to direct lookup
      Object value = carrier.get(key);
      return (value instanceof String) ? (String) value : null;
    }
  };
}
