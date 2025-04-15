import { Link } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import { useEffect } from 'react';
import { withSpan } from '../lib/tracing';

const Cart = () => {

  const {
    cart,
    isLoading,
    error,
    loadCart,
    setCartQuantity
  } = useCart();

  // Load cart data on component mount with proper tracing
  useEffect(() => {
    const loadCartData = () => {
      withSpan('CartPage', 'loadCart', async () => {
        await loadCart();
      }, { 'page': 'cart' });
    };
    
    loadCartData();
  }, [loadCart]);
  
  // Calculate cart total
  const cartTotal = cart?.items?.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  ) || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error.message}</p>
            <button
              onClick={() => loadCart()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200"
            >
              Try Again
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
            <Link
              to="/products"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 bg-gray-50 rounded-lg flex items-center justify-center">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="max-w-full max-h-full object-contain p-2"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-base font-semibold truncate">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm">
                    ${item.product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      disabled={item.quantity === 0}
                      onClick={() => setCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => setCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Increase quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-sm">${(item.product.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => setCartQuantity(item.product.id, 0)}
                    className="mt-2 p-1.5 text-red-600 hover:bg-red-50 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Remove item"
                    title="Remove from cart"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
          <div className="flex justify-between items-center mb-3 border-b pb-3">
            <span className="text-gray-700">Subtotal:</span>
            <span className="font-semibold">${cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-4">
            <span className="font-semibold text-lg">Total:</span>
            <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
          </div>

          {cart.items.length > 0 ? (
            <Link
              to="/checkout"
              className="block w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200 font-medium text-center"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <button
              className="block w-full px-4 py-3 bg-indigo-400 text-white rounded-lg cursor-not-allowed opacity-50 font-medium text-center"
              disabled
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart; 
