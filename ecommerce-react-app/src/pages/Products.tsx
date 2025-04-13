import {useQuery} from "@tanstack/react-query";
import { Product } from "../types";
import { useCart } from "../contexts/useCart";


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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-gray-600">Loading products...</p>
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
          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-3">
              <div className="flex justify-center items-center h-40 mb-3 bg-gray-50 rounded-lg">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-w-[300px] max-h-[300px] object-contain p-4"
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                {product.name}
              </h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  disabled={isProductInCart(product.id)}
                  onClick={() => handleAddToCart(product.id)}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors duration-200"
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
