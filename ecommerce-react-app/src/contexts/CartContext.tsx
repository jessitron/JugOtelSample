// cart/CartContext.tsx
import {
    createContext,
    ReactNode,
} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Cart } from "../types";
import { CartContextType, fetchCart } from './cartTypes';
import { toast } from 'react-toastify';
import { recordError } from '../lib/tracing';
import { checkout as performCheckout, CheckoutResponse } from '../services/checkoutService';

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };

// Fetch cart from API
// const productsInCart = data.items.forEach((current: CartItem) => {
//     numbers.add(current.product.id);
// });

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();

    const {
        data: cart = {
            sessionId: '',
            id: 0,
            items: []
        },
        isLoading,
        error,
        refetch 
    } = useQuery<Cart>({
        queryKey: ['cart'],
        queryFn: fetchCart,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const setQuantityMutation = useMutation({
        mutationFn: async (cartChange : { productId: number, quantity: number }) => {
            const result = await fetch(`/api/cart/items/${cartChange.productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': sessionStorage.getItem('session.id') || '',
                },
                body: JSON.stringify({productId: cartChange.productId, quantity: cartChange.quantity}),
            })

            return result;
        }
    })
    const addMutation = useMutation({
        mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
            const res = await fetch(`/api/cart/items/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': sessionStorage.getItem('session.id') || '',
                },
                body: JSON.stringify({ productId: productId, quantity })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const errorMessage = errorData.message || `Error ${res.status}: Failed to add item to cart`;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error: Error) => {
            console.error('Failed to add item:', error);
            toast.error('An unexpected error occurred. This will be reported');
            recordError('CartContext.addMutation', error, {
                'cart.operation': 'addToCart',
                'cart.status': 'error'
            });
        }
    });

    const removeMutation = useMutation({
        mutationFn: async ({productId, quantity}: {productId: number, quantity: number}) => {
            const res = await fetch(`/api/cart/items/${productId}`, {
                method: 'POST',
                headers: {
                    'X-User-ID': sessionStorage.getItem('session.id') || '',
                },
                body: JSON.stringify({ productId: productId, quantity })
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const errorMessage = errorData.message || `Error ${res.status}: Failed to remove item from cart`;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error: Error) => {
            console.error('Failed to remove item:', error);
            toast.error('An unexpected error occurred. This will be reported');
            recordError('CartContext.removeMutation', error, {
                'cart.operation': 'removeFromCart',
                'cart.status': 'error'
            });
        }
    });

    const checkoutMutation = useMutation<CheckoutResponse, Error>({
        mutationFn: performCheckout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Order placed successfully!');
        },
        onError: (error: Error) => {
            console.error('Failed to checkout:', error);
            toast.error(error.message || 'Failed to place order');
            recordError('CartContext.checkoutMutation', error, {
                'cart.operation': 'checkout',
                'cart.status': 'error'
            });
        }
    });

    const clearCartMutation= useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/cart`, {
                method: 'DELETE',
                headers: {
                    'X-User-ID': sessionStorage.getItem('session.id') || '',
                },
                body: JSON.stringify({})
            });
            if (!res.ok) throw new Error('Failed to remove item');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    });

    const addToCart = (productId: number, quantity?: number) => {
        addMutation.mutate({ productId, quantity: quantity ?? 1 });
    };

    const removeFromCart = (productId: number, quantity?: number) => {
        removeMutation.mutate({ productId: productId, quantity: quantity ?? 1 });
    };

    const clearCart = () => {
       clearCartMutation.mutate();
    }

    const setCartQuantity = (productId: number, quantity: number) => {
        setQuantityMutation.mutate({ productId: productId, quantity: quantity });
    };

    const checkout = () => {
        checkoutMutation.mutate();
    };

    const loadCart = () => {
        refetch();
    };

    const isProductInCart = (productId: number) => {
        return cart?.items.some(item => item.product.id === productId) || false;
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            isLoading, 
            isProductInCart,
            addToCart,
            checkout,
            error,
            loadCart,
            clearCart,
            removeFromCart, 
            setCartQuantity,
            productIdsInCart: new Set(cart.items.map(item => item.product.id))
        }}>
            {children}
        </CartContext.Provider>
    );
};


