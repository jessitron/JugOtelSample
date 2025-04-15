import { Link } from 'react-router-dom';
import { useCart } from '../contexts/useCart';

const Navigation = () => {
  const { cart, clearCart } = useCart();

  return (
      <header className="bg-indigo-600 text-white px-6 py-4 w-full">
        <div className="flex justify-between items-center">
          <h1 className="font-roboto text-2xl font-bold">HoneyShop</h1>
          <nav className="flex items-center space-x-6 text-lg">
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            <Link to="/products" className="hover:text-yellow-400">Products</Link>
            <Link to="/cart" className="hover:text-yellow-400">Cart
              {cart && cart.items && cart.items.length > 0 && (
                <span className="ml-1">({cart.items.length} Items)</span>
              )}
            </Link>
            <Link to="/chat" className="hover:text-yellow-400">Chat</Link>
            {cart && cart.items && cart.items.length > 0 && (
              <button 
                onClick={clearCart}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
              >
                Clear Cart
              </button>
            )}
          </nav>
        </div>
      </header>
  );
};

export default Navigation; 
