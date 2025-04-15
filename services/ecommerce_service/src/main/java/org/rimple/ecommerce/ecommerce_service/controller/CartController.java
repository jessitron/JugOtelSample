package org.rimple.ecommerce.ecommerce_service.controller;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.instrumentation.annotations.WithSpan;
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

    @WithSpan(value = "updateItemQuantity")
    @PostMapping("/items/{productId}")
    public Cart updateItemQuantity(
        @RequestHeader("X-User-ID") String userId,
        @PathVariable Long productId,
        @RequestBody CartOperationDTO operation
    ) {
        Span currentSpan = Span.current();
        currentSpan.setAttribute("app.user-id", userId);
        currentSpan.setAttribute("app.product-id", productId);
        currentSpan.setAttribute("app.product-desired-quantity", operation.getQuantity());
        return cartService.updateQuantityInCart(userId, productId, operation.getQuantity());
    }

    @WithSpan(value = "deleteCart")
    @DeleteMapping
    public void deleteCart(@RequestHeader("X-User-ID") String userId) {
       Span currentSpan = Span.current();
       currentSpan.setAttribute("app.user-id", userId);
       cartService.removeCart(userId);
    }
}
