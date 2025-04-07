package org.rimple.ecommerce.ecommerce_service.controller;

import org.rimple.ecommerce.ecommerce_service.model.Cart;
import org.rimple.ecommerce.ecommerce_service.service.CartService;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/items")
    public Cart addToCart(
        @RequestHeader("X-User-ID") String userId,
        @RequestParam Long productId,
        @RequestParam(defaultValue = "1") Integer quantity
    ) {
        return cartService.addToCart(userId, productId, quantity);
    }

    @DeleteMapping("/items/{productId}")
    public Cart removeFromCart(
        @RequestHeader("X-User-ID") String userId,
        @PathVariable Long productId
    ) {
        return cartService.removeFromCart(userId, productId);
    }
} 