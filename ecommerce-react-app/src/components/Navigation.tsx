import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import {useSessionId} from "../hooks/useSessionId.ts";
import { Chat } from './Chat/Chat';

const Navigation = () => {
  const sessionId = useSessionId();
  const { cart } = useCart();

  return (
    <>
      <nav className="bg-white shadow-md w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              E-Commerce for - { sessionId }
            </Link>
            <div className="flex space-x-8">
              <Link to="/products" className="text-gray-700 hover:text-indigo-600">
                Products
              </Link>
              <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600">
                Cart
                {cart && cart.items && cart.items.length > 0 && (
                  <span className="absolute -top-2 -right-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                    {cart.items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Chat />
    </>
  );
};

export default Navigation; 
