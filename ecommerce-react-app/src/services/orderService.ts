import { CheckoutFormData } from '../components/CheckoutForm';

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentInfo: {
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
  };
}

export const submitOrder = async (cartItems: OrderItem[], formData: CheckoutFormData): Promise<{ orderId: number }> => {
  const orderRequest: OrderRequest = {
    items: cartItems,
    shippingAddress: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    },
    paymentInfo: {
      cardNumber: formData.cardNumber,
      cardExpiry: formData.cardExpiry,
      cardCvv: formData.cardCvv,
    },
  };

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderRequest),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit order');
  }

  return response.json();
}; 