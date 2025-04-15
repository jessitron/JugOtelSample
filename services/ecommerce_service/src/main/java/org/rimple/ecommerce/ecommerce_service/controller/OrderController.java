package org.rimple.ecommerce.ecommerce_service.controller;

import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.StatusCode;
import io.opentelemetry.api.trace.Tracer;
import org.rimple.ecommerce.ecommerce_service.dto.OrderResponseDTO;
import org.rimple.ecommerce.ecommerce_service.service.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponseDTO> getOrders(@RequestHeader("X-User-ID") String userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @PostMapping("/checkout")
    public OrderResponseDTO checkout(@RequestHeader("X-User-ID") String userId) {
        Tracer tracer = GlobalOpenTelemetry.getTracer("ecommerce-service");
        Span span = tracer.spanBuilder("checkout").startSpan();
        span.setAttribute("user_id", userId);
        try {
            return orderService.checkout(userId);
        } catch (Exception e) {
            span.setStatus(StatusCode.ERROR, "Checkout failed");
            span.recordException(e);
            throw e;
        } finally {
            span.end();
        }
    }
} 
