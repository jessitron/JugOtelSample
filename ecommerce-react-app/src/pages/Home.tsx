import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-6 text-gray-900">
        Welcome to Our Store
      </h1>
      <p className="text-xl mb-8 text-gray-600">
        Discover amazing products at great prices
      </p>
      <Link
        to="/products"
        className="inline-block px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors duration-200"
      >
        Shop Now
      </Link>
    </div>
  );
};

export default Home; 