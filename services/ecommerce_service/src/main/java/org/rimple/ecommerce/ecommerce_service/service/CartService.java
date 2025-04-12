package org.rimple.ecommerce.ecommerce_service.service;

import org.rimple.ecommerce.ecommerce_service.model.Cart;
import org.rimple.ecommerce.ecommerce_service.model.CartItem;
import org.rimple.ecommerce.ecommerce_service.model.Product;
import org.rimple.ecommerce.ecommerce_service.repository.CartRepository;
import org.rimple.ecommerce.ecommerce_service.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public Cart getCart(String userId) {
        return cartRepository.findByUserId(userId)
            .orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setUserId(userId);
                return cartRepository.save(newCart);
            });
    }

    /**
     * Create a new cart item if user hasn't added yet
     * otherwise add the quantity requested to an existing
     * cart item.
     * @param userId
     * @param productId
     * @param quantity
     * @return
     */
    @Transactional
    public Cart addToCart(String userId, Long productId, Integer quantity) {
        Cart cart = getCart(userId);
        Product product = productRepository.findById(productId).orElseThrow();
        
        Optional<CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    /**
     * Removes an item from the cart if we request to remove the entire quantity, otherwise decrements by quantity
     * @param userId
     * @param productId
     * @param quantity
     * @return
     */
    @Transactional
    public Cart removeFromCart(String userId, Long productId, Integer removeQuantity) {
        Cart cart = getCart(userId);
        // fetch the item
        Optional<CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst();

        if (existingItem.isPresent()) {
            var cartItem = existingItem.get();
            if (cartItem.getQuantity() <= removeQuantity) {
                cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
            } else {
                cartItem.setQuantity(cartItem.getQuantity() - removeQuantity);
            }
            return cartRepository.save(cart);
        }
        throw new RuntimeException("No such cart item");
    }

    /**
     * Sets an exact quantity in cart, ignoring the existing amount.
     * @param userId
     * @param productId
     * @param quantity
     * @return
     */
    @Transactional
    public Cart setQuantityInCart(String userId, Long productId, Integer quantity) {
        Cart cart = getCart(userId);
        Product product = productRepository.findById(productId).orElseThrow();

        Optional<CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart createCart(String userId) {
        Cart cart = createCart(userId);
        return cartRepository.save(cart);
    }
} 
