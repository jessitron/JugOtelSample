package org.rimple.ecommerce.ecommerce_service.service;

import io.opentelemetry.api.trace.Span;
import org.rimple.ecommerce.ecommerce_service.model.Cart;
import org.rimple.ecommerce.ecommerce_service.model.CartItem;
import org.rimple.ecommerce.ecommerce_service.model.Product;
import org.rimple.ecommerce.ecommerce_service.repository.CartRepository;
import org.rimple.ecommerce.ecommerce_service.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
     * Sets an exact quantity in cart, ignoring the existing amount.
     * @param userId
     * @param productId
     * @param quantity
     * @return
     */
    @Transactional
    public Cart updateQuantityInCart(String userId, Long productId, Integer quantity) {
        // Grab the existing span (from the controller)
        Span span = Span.current();

        Cart cart = getCart(userId);

        Product product = productRepository.findById(productId).orElseThrow();
        // Hey, team. I've put a nice little easter egg in here
        // to make everyone laugh. April FOOLS!
        // featurette 1 - for one item, please wait...
        if (productId == 8L) {
            try {
                Thread.sleep(4000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        // featurette 2 - some product #5 blows up, so it's our time!
        if (productId == 5L) {
            throw new RuntimeException("Bam! Something bad happened to our product catalog!");
        }

        // TODO there has GOT to be a simpler way
        var item = cart.getItems()
           .stream()
           .filter(item1 -> item1.getProduct().getId().equals(productId))
           .findFirst();

        // it doesn't exist
        if (item.isEmpty()) {
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
            return cartRepository.save(cart);
        }

        var hydratedItem = item.get();
        span.setAttribute("app.item-old-quantity", item.get().getQuantity());

        if (quantity == 0) {
            cart.getItems().remove(hydratedItem);
            span.setAttribute("app.item.removed", true);
            return cartRepository.save(cart);
        }

        // otherwise, find it and if exists, update, otherwise create
        span.setAttribute("app.item-new-quantity", quantity);
        hydratedItem.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart createCart(String userId) {
        // Grab the existing span (from the controller)
        Span span = Span.current();
        Cart cart = new Cart();
        cart.setUserId(userId);
        span.setAttribute("app.cart-created", true);
        return cartRepository.save(cart);
    }

    @Transactional
    public void removeCart(String userId) {
        // Grab the existing span (from the controller)
        Span span = Span.current();
        span.setAttribute("app.cart-deleted", true);
        cartRepository.deleteByUserId(userId);
    }
} 
