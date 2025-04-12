export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
} 