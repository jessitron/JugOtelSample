import { Cart } from "../types";

export interface CartContextType {
    cart: Cart;
    isLoading: boolean;
    error: Error | null;
    loadCart: () => void;
    addToCart: (productId: number, quantity?: number) => void;
    checkout: () => void;
    clearCart: () => void;
    isProductInCart: (productId: number) => boolean;
    removeFromCart: (productId: number, quantity?: number) => void;
    setCartQuantity: (productId: number, quantity: number) => void;
    productIdsInCart: Set<number>;
}

export const fetchCart = async (): Promise<Cart> => {
    const response = await fetch('/api/cart', {
        method: 'GET',
        headers: {
            'X-User-ID': sessionStorage.getItem('session.id') || ''
        }
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return await response.json() as Cart;
}; 