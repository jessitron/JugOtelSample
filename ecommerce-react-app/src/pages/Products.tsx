import {useQuery} from "@tanstack/react-query";
import { Product } from "../types";
import { useCart } from "../contexts/useCart";
import ProductCardSkeleton from "../components/ProductCardSkeleton";


const Products = () => {

  const { addToCart, isProductInCart } = useCart();

  const { error, data, isFetching } = useQuery({
      queryKey: ['products'],
      queryFn: async () => {
         const response = await fetch('/api/products', {
             headers: {
                 'X-User-ID': sessionStorage.getItem('session.id') || 'anonymous'
             }
         });
         return await response.json();
      }
  });

  const handleAddToCart = async (productId: number) => {
    addToCart(productId, 1);
  };

  if (isFetching) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((product: Product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
            <div className="p-3 flex flex-col flex-grow">
              <div className="flex-grow mb-3">
                <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="flex justify-center items-center h-48 w-48 sm:h-72 sm:w-72 md:h-96 md:w-96 bg-gray-50 rounded-lg mx-auto">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain p-4"
                />
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  disabled={isProductInCart(product.id)}
                  onClick={() => handleAddToCart(product.id)}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
