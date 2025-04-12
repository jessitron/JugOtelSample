package org.rimple.ecommerce.ecommerce_service.otel;

import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.*;
import io.opentelemetry.context.Scope;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@RequiredArgsConstructor
public class MethodTracingAspect {

  private Logger log = LoggerFactory.getLogger(MethodTracingAspect.class);
  private final Tracer tracer =
      GlobalOpenTelemetry.getTracer("ecommerce-service");

  @Around("execution(* org.rimple.ecommerce.ecommerce_service.repository..*(..))")
  public Object traceMethod(ProceedingJoinPoint pjp) throws Throwable {
    MethodSignature methodSig = (MethodSignature) pjp.getSignature();
    String methodName = methodSig.getDeclaringTypeName() + "." + methodSig.getName();

    Span span = tracer.spanBuilder(methodName)
        .setAttribute("component", "application")
        .setAttribute("method.name", methodName)
        .startSpan();

    try (Scope scope = span.makeCurrent()) {
      Object[] args = pjp.getArgs();
      span.setAttribute("method.args", Arrays.toString(args));
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
