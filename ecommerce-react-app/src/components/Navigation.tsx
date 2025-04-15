import { Link } from 'react-router-dom';
import { useCart } from '../contexts/useCart';

const Navigation = () => {
  const { cart, clearCart } = useCart();

  return (
    <header className="bg-indigo-600 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="font-roboto text-2xl font-bold">HoneyShop</h1>
          <nav className="flex space-x-6 text-lg">
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            <Link to="/products" className="hover:text-yellow-400">Products</Link>
            <Link to="/cart" className="hover:text-yellow-400">
              Cart {cart?.items?.length > 0 && `(${cart.items.length})`}
            </Link>
            <Link to="/chat" className="hover:text-yellow-400">Chat</Link>
          </nav>
        </div>
        {cart?.items?.length > 0 && (
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Empty Cart
          </button>
        )}
      </div>
    </header>
  );
};

export default Navigation; 
