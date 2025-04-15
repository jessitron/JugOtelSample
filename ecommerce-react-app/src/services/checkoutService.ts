import { recordError } from '../lib/tracing';

export interface CheckoutResponse {
    orderId: number;
    status: string;
    message?: string;
}

export const checkout = async (): Promise<CheckoutResponse> => {
    try {
        const userId = sessionStorage.getItem('session.id') || '';
        const response = await fetch('/api/orders/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': userId,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Error ${response.status}: Failed to checkout`;
            throw new Error(errorMessage);
        }

        return response.json();
    } catch (error) {
        recordError('checkoutService.checkout', error as Error, {
            'checkout.operation': 'checkout',
            'checkout.status': 'error'
        });
        throw error;
    }
}; 