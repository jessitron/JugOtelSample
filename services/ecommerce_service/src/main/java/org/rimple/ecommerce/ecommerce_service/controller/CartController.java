package org.rimple.ecommerce.ecommerce_service.controller;

import org.rimple.ecommerce.ecommerce_service.dto.CartOperationDTO;
import org.rimple.ecommerce.ecommerce_service.model.Cart;
import org.rimple.ecommerce.ecommerce_service.repository.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public Cart getCart(@RequestHeader("X-User-ID") String userId) {
        return cartService.getCart(userId);
    }

    @PostMapping
    public Cart createCart(@RequestHeader("X-User-ID") String userId) {
        return cartService.createCart(userId);
    }

    @PostMapping("/items")
    public Cart addToCart(
        @RequestHeader("X-User-ID") String userId,
        @RequestBody CartOperationDTO operation
    ) {
        return cartService.addToCart(userId, operation.getProductId(), operation.getQuantity());
    }

    @DeleteMapping("/items/{productId}")
    public Cart removeFromCart(
        @RequestHeader("X-User-ID") String userId,
        @PathVariable Long productId
    ) {
        return cartService.removeFromCart(userId, productId);
    }
} 
