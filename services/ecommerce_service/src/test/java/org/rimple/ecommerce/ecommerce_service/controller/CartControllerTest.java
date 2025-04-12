package org.rimple.ecommerce.ecommerce_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.rimple.ecommerce.ecommerce_service.dto.CartOperationDTO;
import org.rimple.ecommerce.ecommerce_service.model.Cart;
import org.rimple.ecommerce.ecommerce_service.model.CartItem;
import org.rimple.ecommerce.ecommerce_service.model.Product;
import org.rimple.ecommerce.ecommerce_service.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.hasValue;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CartController.class)
class CartControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private CartService cartService;

  private Cart createMockCart(String userId) {
    Product product = new Product();
    product.setId(1L);
    product.setName("Test Product");
    product.setPrice(99.99);

    CartItem item = new CartItem();
    item.setId(1L);
    item.setProduct(product);
    item.setQuantity(2);

    Cart cart = new Cart();
    cart.setId(100L);
    cart.setUserId(userId);
    cart.setItems(List.of(item));
    return cart;
  }

  @Test
  void testGetCart() throws Exception {
    Cart cart = createMockCart("user123");
    Mockito.when(cartService.getCart("user123")).thenReturn(cart);

    mockMvc.perform(get("/api/cart")
            .header("X-User-ID", "user123"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items", hasSize(1)))
        .andExpect(jsonPath("$.items[0].quantity").value(2));
  }

  @Test
  void testCreateCart() throws Exception {
    Cart cart = createMockCart("user123");
    Mockito.when(cartService.createCart("user123")).thenReturn(cart);

    mockMvc.perform(post("/api/cart")
            .header("X-User-ID", "user123"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.userId").value("user123"));
  }

  @Test
  void testAddToCart() throws Exception {
    CartOperationDTO dto = new CartOperationDTO();
    dto.setQuantity(3);

    Cart cart = createMockCart("user123");
    Mockito.when(cartService.addToCart("user123", 1L, 3)).thenReturn(cart);

    mockMvc.perform(post("/api/cart/items/1")
            .header("X-User-ID", "user123")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dto)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items", hasSize(1)));
  }

  @Test
  void testUpdateItemQuantity() throws Exception {
    CartOperationDTO dto = new CartOperationDTO();
    dto.setQuantity(9);

    // the cart to return
    Cart cart = createMockCart("user123");
    cart.getItems().getFirst().setQuantity(9);
    Mockito.when(cartService.updateQuantityInCart("user123", 1L, 9)).thenReturn(cart);

    mockMvc.perform(put("/api/cart/items/1")
        .header("X-User-ID", "user123")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(dto)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items", hasSize(1)))
        .andExpect(jsonPath("$.items[0].quantity").value(9));
    Mockito.verify(cartService).updateQuantityInCart("user123", 1L, 9);
  }


  @Test
  void testRemoveFromCart() throws Exception {
    CartOperationDTO dto = new CartOperationDTO();
    dto.setQuantity(1);

    Cart cart = createMockCart("user123");
    Mockito.when(cartService.removeFromCart("user123", 1L, 1)).thenReturn(cart);

    mockMvc.perform(delete("/api/cart/items/1")
            .header("X-User-ID", "user123")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dto)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items", hasSize(1)));
  }
}
