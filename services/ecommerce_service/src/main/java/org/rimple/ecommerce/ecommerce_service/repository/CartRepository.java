package org.rimple.ecommerce.ecommerce_service.repository;

import org.rimple.ecommerce.ecommerce_service.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // eager fetch to get full
    @Query("""
         SELECT c FROM Cart c
         LEFT JOIN FETCH c.items i
         LEFT JOIN FETCH i.product
         WHERE c.userId = :userId
         """)
    Optional<Cart> findByUserId(String userId);

  @Query("""
        DELETE FROM Cart c
        WHERE c.userId = :userId
        """)
  @Modifying
  void deleteByUserId(String userId);
}
