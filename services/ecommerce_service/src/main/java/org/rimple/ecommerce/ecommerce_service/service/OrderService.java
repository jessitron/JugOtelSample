package org.rimple.ecommerce.ecommerce_service.service;

import org.rimple.ecommerce.ecommerce_service.model.*;
import org.rimple.ecommerce.ecommerce_service.repository.CartRepository;
import org.rimple.ecommerce.ecommerce_service.repository.OrderRepository;
import org.rimple.ecommerce.ecommerce_service.dto.OrderResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    public OrderService(OrderRepository orderRepository, CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
    }

    public List<OrderResponseDTO> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId).stream()
            .map(order -> new OrderResponseDTO(
                order.getId(),
                order.getUserId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getItems().stream()
                    .map(item -> new OrderResponseDTO.OrderItemDTO(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getPriceAtTime(),
                        item.getQuantity(),
                        item.getCreatedAt()
                    ))
                    .collect(java.util.stream.Collectors.toList())
            ))
            .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public OrderResponseDTO checkout(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

        Order order = new Order();
        order.setUserId(userId);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setTotalAmount(0.0);
        order.setItems(new ArrayList<>());

        // Convert cart items to order items
        cart.getItems().forEach(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtTime(cartItem.getProduct().getPrice());
            orderItem.setCreatedAt(LocalDateTime.now());
            orderItem.setPurchaseOrder(order);
            order.getItems().add(orderItem);
            order.setTotalAmount(order.getTotalAmount() + (orderItem.getPriceAtTime() * orderItem.getQuantity()));
        });

        // Save the order first
        Order savedOrder = orderRepository.save(order);
        
        // Then delete the cart
        cartRepository.deleteByUserId(userId);

        // Convert to DTO
        return new OrderResponseDTO(
            savedOrder.getId(),
            savedOrder.getUserId(),
            savedOrder.getTotalAmount(),
            savedOrder.getStatus(),
            savedOrder.getCreatedAt(),
            savedOrder.getUpdatedAt(),
            savedOrder.getItems().stream()
                .map(item -> new OrderResponseDTO.OrderItemDTO(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getPriceAtTime(),
                    item.getQuantity(),
                    item.getCreatedAt()
                ))
                .collect(Collectors.toList())
        );
    }
} 
