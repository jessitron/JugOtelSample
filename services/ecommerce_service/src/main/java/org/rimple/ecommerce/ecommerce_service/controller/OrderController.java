package org.rimple.ecommerce.ecommerce_service.controller;

import org.rimple.ecommerce.ecommerce_service.model.Order;
import org.rimple.ecommerce.ecommerce_service.service.OrderService;
import org.springframework.http.ResponseEntity;
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
    public List<Order> getOrders(@RequestHeader("X-User-ID") String userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @PostMapping("/checkout")
    public Order checkout(@RequestHeader("X-User-ID") String userId) {
        return orderService.checkout(userId);
    }
} 