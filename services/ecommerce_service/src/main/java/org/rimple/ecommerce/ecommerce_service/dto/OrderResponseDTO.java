package org.rimple.ecommerce.ecommerce_service.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
    Long id,
    String userId,
    Double totalAmount,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<OrderItemDTO> items
) {
    public record OrderItemDTO(
        Long id,
        Long productId,
        String productName,
        Double priceAtTime,
        Integer quantity,
        LocalDateTime createdAt
    ) {}
} 