package org.rimple.ecommerce.ecommerce_service.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.rimple.ecommerce.ecommerce_service.model.Cart;
import org.rimple.ecommerce.ecommerce_service.model.CartItem;
import org.rimple.ecommerce.ecommerce_service.model.Product;
import org.rimple.ecommerce.ecommerce_service.repository.CartRepository;
import org.rimple.ecommerce.ecommerce_service.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@Transactional
public class CartServiceTest {

  @Autowired
  private CartService cartService;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CartRepository cartRepository;

  private Product testProduct;

  @BeforeEach
  public void setup() {
    testProduct = new Product();
    testProduct.setName("Test Product");
    testProduct.setPrice(100.0);
    testProduct.setDescription("Test Description");
    testProduct.setImageUrl("/test-product.jpg");
    productRepository.save(testProduct);
  }

  @Test
  public void shouldCreateCartForUserIfNotExists() {
    Cart cart = cartService.getCart("user123");
    assertThat(cart.getUserId()).isEqualTo("user123");
    assertThat(cart.getItems()).isEmpty();
  }

  @Test
  public void shouldAddNewItemToCart() {
    Cart cart = cartService.addToCart("user123", testProduct.getId(), 2);
    assertThat(cart.getItems()).hasSize(1);
    CartItem item = cart.getItems().getFirst();
    assertThat(item.getProduct().getId()).isEqualTo(testProduct.getId());
    assertThat(item.getQuantity()).isEqualTo(2);
  }

  @Test
  public void shouldIncreaseQuantityIfItemExists() {
    cartService.addToCart("user123", testProduct.getId(), 2);
    Cart updated = cartService.addToCart("user123", testProduct.getId(), 3);
    assertThat(updated.getItems()).hasSize(1);
    assertThat(updated.getItems().getFirst().getQuantity()).isEqualTo(5);
  }

  @Test
  public void shouldSetExactQuantity() {
    cartService.addToCart("user123", testProduct.getId(), 1);
    Cart updated = cartService.updateQuantityInCart("user123", testProduct.getId(), 10);
    assertThat(updated.getItems()).hasSize(1);
    assertThat(updated.getItems().getFirst().getQuantity()).isEqualTo(10);
  }

  @Test
  public void shouldRemoveItemIfQuantityExceedsSize() {
    cartService.addToCart("user123", testProduct.getId(), 1);
    Cart updated = cartService.removeFromCart("user123", testProduct.getId(), 10);
    assertThat(updated.getItems()).hasSize(0);
  }

  @Test
  public void shouldDecrementItemQuantity() {
    cartService.addToCart("user123", testProduct.getId(), 5);
    Cart updated = cartService.removeFromCart("user123", testProduct.getId(), 2);
    assertThat(updated.getItems()).hasSize(1);
    assertThat(updated.getItems().getFirst().getQuantity()).isEqualTo(3); // 5 - 2
  }

  @Test
  public void shouldPersistChangesInRepository() {
    cartService.addToCart("user123", testProduct.getId(), 2);
    Cart persisted = cartRepository.findByUserId("user123").orElseThrow();
    assertThat(persisted.getItems()).hasSize(1);
  }
}
