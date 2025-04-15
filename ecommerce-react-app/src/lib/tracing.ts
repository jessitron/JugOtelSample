import { trace, SpanStatusCode, context } from '@opentelemetry/api';

const tracer = trace.getTracer('ecommerce-react-app');

/**
 * Records an error as a span event with the exception details
 * 
 * @param component The component or context where the error occurred
 * @param error The error object
 * @param attributes Additional attributes to add to the span
 */
export function recordError(component: string, error: Error, attributes: Record<string, string | number | boolean> = {}) {
  // Get the current active span if one exists
  const currentSpan = trace.getActiveSpan();
  
  if (currentSpan) {
    // Add error attributes to the current span
    currentSpan.setStatus({ code: SpanStatusCode.ERROR });
    currentSpan.recordException(error);
    currentSpan.setAttributes({
      'error': true,
      'error.type': error.name,
      'error.message': error.message,
      'error.component': component,
      ...attributes
    });
  } else {
    // Create a new error span if there's no active span
    const errorSpan = tracer.startSpan(`${component}.error`);
    errorSpan.setStatus({ code: SpanStatusCode.ERROR });
    errorSpan.recordException(error);
    errorSpan.setAttributes({
      'error': true,
      'error.type': error.name,
      'error.message': error.message,
      'error.component': component,
      ...attributes
    });
    errorSpan.end();
  }
}

/**
 * Wraps a function with tracing
 * 
 * @param component The component or context name
 * @param operation The operation being performed
 * @param fn The function to wrap
 * @param attributes Additional attributes to add to the span
 */
export function withSpan<T>(
  component: string, 
  operation: string, 
  fn: () => Promise<T>, 
  attributes: Record<string, string | number | boolean> = {}
): Promise<T> {
  const span = tracer.startSpan(`${component}.${operation}`);
  
  span.setAttributes({
    'component': component,
    'operation': operation,
    ...attributes
  });
  
  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await fn();
      span.end();
      return result;
    } catch (error: unknown) {
      const errorObject = error instanceof Error ? error : new Error(String(error));
      span.setStatus({ code: SpanStatusCode.ERROR });
      span.recordException(errorObject);
      span.setAttributes({
        'error': true,
        'error.type': errorObject.name,
        'error.message': errorObject.message
      });
      span.end();
      throw error;
    }
  });
} 