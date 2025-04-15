import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Navigation = () => {
  const { cart } = useCart();

  return (
      <header className="bg-indigo-600 text-white px-6 py-4 w-full">
        <h1 className="font-roboto text-2xl font-bold">HoneyShop</h1>
        <nav className="space-x-6 text-lg w-full">
          <Link to="/" className="hover:text-yellow-400">Home</Link>
          <Link to="/products" className="hover:text-yellow-400">Products</Link>
          <Link to="/cart" className="hover:text-yellow-400">Cart
            {cart && cart.items && cart.items.length > 0 && (
                <>{ cart.items.length} Items</>
            )}
          </Link>
          <Link to="/chat" className="hover:text-yellow-400">Chat</Link>
        </nav>
      </header>
  );
};

export default Navigation; 
