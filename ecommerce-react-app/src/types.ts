export interface Product {
    id: number;
    name: string;
    imageUrl: string;
    description: string;
    price: number;
}

export interface CartItem {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    product: Product;
}

export interface Cart {
    sessionId: string;
    id: number;
    items: CartItem[]
}