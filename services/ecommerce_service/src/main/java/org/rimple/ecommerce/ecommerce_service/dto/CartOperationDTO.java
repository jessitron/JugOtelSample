package org.rimple.ecommerce.ecommerce_service.dto;

import lombok.Data;

@Data
public class CartOperationDTO {
    private Long productId;
    private Integer quantity = 1;
} 