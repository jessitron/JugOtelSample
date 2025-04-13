import { useEffect, useState } from 'react';
import {Product} from "../types.ts";



export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/products', {
                headers: {
                    'X-User-ID': sessionStorage.getItem('session.id') || 'anonymous'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to load product catalog');
            }
            const data = await response.json();
            // Ensure we're working with an array
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load cart');
            setProducts([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    // on use of effect, load 'em up
    useEffect(() => {
        loadProducts();
    }, []);

    return {
        products,
        isLoading,
        error
    }
}

