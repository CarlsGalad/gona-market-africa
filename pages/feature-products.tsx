import { useItemContext } from '@/context/ItemProvider';
import { useRouter } from 'next/router';
import { FaShoppingBag, FaHeart, FaShareAlt } from 'react-icons/fa'; 
import { useState } from 'react';
import { formatCurrency } from '@/utils/currencyFormatter';
import CircularLoader from '@/components/CircularLoader';
import { Item } from '@/models/Item';

const FeatureProducts = () => {
  const {
    items,
    isLoading,
    error,
    addItemToCart,
    addItemToFavorites,
    isItemFavorite,
  } = useItemContext();
  
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Handle item click
  const handleItemClick = (id: string) => {
    router.push(`/item_detail/${id}`);
  };

  // Sort items by price
  const sortedItems = [...items].sort((a: Item, b: Item) => {
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
  });

  if (isLoading) return <CircularLoader />; 
  if (error) return <p className="flex justify-center items-center min-h-screen">{error}</p>;

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-6 py-3 text-center text-gray-700 shadow-xl w-screen">Featured Products</h1>
      <div className='container mx-auto px-4 py-8'>
        {/* Sorting Options */}
        <div className="flex justify-end mb-4">
          <label htmlFor="sortOrder" className="mr-2 text-gray-700">Sort by Price:</label>
          <select 
            id="sortOrder" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} 
            className="bg-white border border-gray-300 rounded-xl p-2 text-gray-700"
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedItems.map((item: Item) => (
            <div 
              key={item.id} 
              className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleItemClick(item.id)}
            >
              {/* Product Image */}
              <div className="relative">
                {item.label === 'promo' && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                    Promo
                  </div>
                )}
                <img src={item.itemPath} alt={item.name} className="w-full h-48 object-cover" />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-gray-700">{item.name}</h3>
                <p className="text-gray-700 text-sm mb-2">{formatCurrency(item.price)}</p>
              </div>

              {/* Hover Actions */}
              {hoveredItem === item.id && (
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-10 space-x-9">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItemToCart(item);
                    }}
                    className="text-white text-2xl hover:text-gray-200 transition-colors duration-200"
                    title="Add to Cart"
                  >
                    <FaShoppingBag />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItemToFavorites(item);
                    }}
                    className={`${isItemFavorite(item) ? 'text-red-500' : 'text-white'} text-2xl hover:text-gray-200 transition-colors duration-200`}
                    title="Add to Favorites"
                  >
                    <FaHeart />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.share({ title: item.name, url: window.location.href });
                    }}
                    className="text-white text-2xl hover:text-gray-200 transition-colors duration-200"
                    title="Share"
                  >
                    <FaShareAlt />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureProducts;