package org.rimple.ecommerce.ecommerce_service.controller;

import org.rimple.ecommerce.ecommerce_service.dto.CartOperationDTO;
import org.rimple.ecommerce.ecommerce_service.model.Cart;
import org.rimple.ecommerce.ecommerce_service.service.CartService;
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

    @PostMapping("/items/{productId}")
    public Cart addToCart(
        @RequestHeader("X-User-ID") String userId,
        @PathVariable Long productId,
        @RequestBody CartOperationDTO operation
    ) {
        return cartService.addToCart(userId, productId, operation.getQuantity());
    }

    @PutMapping("/items/{productId}")
    public Cart updateItemQuantity(
        @RequestHeader("X-User-ID") String userId,
        @PathVariable Long productId,
        @RequestBody CartOperationDTO operation
    ) {
        return cartService.updateQuantityInCart(userId, productId, operation.getQuantity());
    }

    @DeleteMapping("/items/{productId}")
    public Cart removeFromCart(
        @RequestHeader("X-User-ID") String userId,
        @PathVariable Long productId,
        @RequestBody CartOperationDTO operation
    ) {
        return cartService.removeFromCart(userId, productId, operation.getQuantity());
    }
} 
