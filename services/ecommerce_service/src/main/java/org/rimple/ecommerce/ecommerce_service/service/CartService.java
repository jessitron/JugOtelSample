package org.rimple.ecommerce.ecommerce_service.service;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.SpanKind;
import io.opentelemetry.api.trace.Tracer;
import org.rimple.ecommerce.ecommerce_service.model.Cart;
import org.rimple.ecommerce.ecommerce_service.model.CartItem;
import org.rimple.ecommerce.ecommerce_service.model.Product;
import org.rimple.ecommerce.ecommerce_service.repository.CartRepository;
import org.rimple.ecommerce.ecommerce_service.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        // OpenTelemetry - add attributes to the current span
        // grab the current span (hint, we create the span in the controller, and until the whole
        // interaction chain between the beans is done, we can add attributes to the span
        Span span = Span.current();
        span.setAttribute("app.product-id", productId);

        if (1 == 1)  { throw new RuntimeException("I do not believe you, Ken");}

        // get my cart
        Cart cart = getCart(userId);

        // see if we already have it in the cart...
        Optional<CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst();

        // calculate the number of products to add
        int newQuantity;
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
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

            // ok, we made it... so, we record the old quantity, calculate the new quantity, set it and record the
            // new value in our span
            span.setAttribute("app.item-old-quantity", item.getQuantity());
            newQuantity = item.getQuantity() + quantity;
            item.setQuantity(newQuantity);
            span.setAttribute("app.item-new-quantity", newQuantity);
        } else {
            CartItem newItem = new CartItem();
            // ok, we have to create a new cart item
            // so we need to get the product
            var product = productRepository.findById(productId).orElseThrow();
            newItem.setProduct(product);
            span.setAttribute("app.item-old-quantity", 0);
            newItem.setQuantity(quantity);
            span.setAttribute("app.item-new-quantity", quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    /**
     * Removes an item from the cart if we request to remove the entire quantity, otherwise decrements by quantity
     * @param userId
     * @param productId
     * @param removeQuantity
     * @return
     */
    @Transactional
    public Cart removeFromCart(String userId, Long productId, Integer removeQuantity) {
        // grab the current span (hint, we create the span in the controller, and until the whole
        // interaction chain between the beans is done, we can add attributes to the span
        Span span = Span.current();

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
    public Cart updateQuantityInCart(String userId, Long productId, Integer quantity) {
        // Grab the existing span (from the controller)
        Span span = Span.current();

        Cart cart = getCart(userId);
        Product product = productRepository.findById(productId).orElseThrow();

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

        if (hydratedItem.getQuantity().equals(0)) {
            span.setAttribute("app.item-old-quantity", item.get().getQuantity());
            // hopefully this works...
            cart.getItems().remove(hydratedItem);
            span.setAttribute("app.item.removed", true);
            return cartRepository.save(cart);
        }

        // otherwise, find it and if exists, update, otherwise create
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
