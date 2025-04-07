package org.rimple.ecommerce.ecommerce_service.repository;

import org.rimple.ecommerce.ecommerce_service.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserId(String userId);
} 