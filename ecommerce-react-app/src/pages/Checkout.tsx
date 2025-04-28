import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import CheckoutForm from '../components/CheckoutForm';
import { CheckoutFormData } from '../components/CheckoutForm';
import { submitOrder, OrderItem } from '../services/orderService';
import {CartItem} from "../types.ts";
const Checkout = () => {
  const navigate = useNavigate();
  const { cart, checkout, clearCart, isLoading, error } = useCart();

  const handleSubmit = async (formData: CheckoutFormData) => {
      // TODO - fix this up
      // Convert cart items to the format expected by the API
      // const orderItems: OrderItem[] = cart.items.map((item): CartItem => ({
      //   productId: item.product.id,
      //   quantity: item.quantity
      // }));

      // Submit the order - based on data in database for the user
      checkout();

      // Clear the cart
      clearCart();
      
      // Navigate to order confirmation page
       navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/cart')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cart.items.length) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cartTotal = cart.items.reduce((prev, curr) => {
    console.log(prev, curr);
    return (prev || 0) + (curr.product.price * curr.quantity);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Order Summary</h3>
            <div className="space-y-2">
              {cart.items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <CheckoutForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Checkout; 
