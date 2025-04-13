import { useState } from 'react';
import { useSessionId } from './useSessionId';
import {Cart} from "../types.ts";

export const useCart = () => {
  const sessionId = useSessionId();
  const [cart, setCart ] = useState<Cart>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // simple trick - it's there or it's not...
  const quantityInCart = (productId: number) =>  cart?.items?.find(item => item.id === productId)?.quantity || 0;

  // TODO - refactor this downward into the service???
  const loadCart = async () => {

    try {
      setIsLoading(true);
      const response = await fetch('/api/cart', {
        headers: {
          'X-User-ID': sessionId
        }
      });

      // first condition, unexpected error
      if (response.status > 404) {
        throw new Error(`Unacceptable response status fetching cart for ${sessionId}`);
      }

      // second condition - if we don't have one... create it
      if (response.status === 404) {
        const createResponse = await fetch('/api/cart', {
          headers: {
            'X-User-ID': sessionId
          },
          method: 'POST'
        })

        // ok, check that create worked
        if (createResponse.status !== 201 ) {
          throw new Error(`Failed to create new cart for ${sessionId}`);
        }
      }

      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
      setCart(undefined); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': sessionId,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    }
  };

  // TODO - this could be better with POST for add, PUT for update, and DELETE for 0 qty
  // instead it's brute force
  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      // First remove the item
      const removeResponse = await fetch(`/api/cart/items/${productId}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': sessionId
        }
      });

      if (!removeResponse.ok) {
        throw new Error('Failed to remove item from cart');
      }

      // Then add it back with the new quantity
      const addResponse = await fetch(`/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': sessionId
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!addResponse.ok) {
        throw new Error('Failed to add item to cart');
      }

      await loadCart();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart');
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': sessionId // TODO: Get from auth service
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      // always resyncs cart
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`/api/cart`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': sessionId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      setCart(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    }

    await loadCart();
  };


  const grandTotal = cart?.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemTotal = (productId: number) => {
    const item = cart?.items?.find(elem => elem.product.id === productId);
    // meh...
    if (!item) return 0;

    // pick a winner, chicken dinner!
    return item.quantity * item.product.price;
  }

  return {
    quantityInCart,
    cart,
    itemTotal,
    grandTotal,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    loadCart,
    clearCart,
  };
};
