package org.rimple.ecommerce.ecommerce_service.otel;

import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.StatusCode;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;

//@Component
//@Aspect
public class MethodTracingAspect {

  private static final Logger log = LoggerFactory.getLogger(MethodTracingAspect.class);
  private final Tracer tracer;

  //@Autowired
  public MethodTracingAspect(OpenTelemetry openTelemetry) {
    this.tracer = openTelemetry.getTracer("ecommerce-service");
  }

  //@Around("execution(* org.rimple.ecommerce.ecommerce_service..*(..))")
  public Object traceMethod(ProceedingJoinPoint pjp) throws Throwable {
    MethodSignature methodSig = (MethodSignature) pjp.getSignature();
    String methodName = methodSig.getDeclaringTypeName() + "." + methodSig.getName();

    // unless you want a LONG span name, use getName of the methodSig without the declaring type
    Span span = tracer.spanBuilder(methodSig.getName())
        .setAttribute("component", "application")
        .setAttribute("method.name", methodName)
        .startSpan();

    try (Scope scope = span.makeCurrent()) {
      span.setAttribute("method.args", Arrays.toString(pjp.getArgs()));
      log.debug("Invoking: {}", methodName);

      Object result = pjp.proceed();

      span.setStatus(StatusCode.OK);
      return result;
    } catch (Throwable t) {
      span.recordException(t);
      span.setStatus(StatusCode.ERROR, "Exception: " + t.getMessage());
      throw t;
    } finally {
      span.end();
      log.debug("Completed: {}", methodName);
    }
  }
}
