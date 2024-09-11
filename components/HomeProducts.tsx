import { useItemContext } from '@/context/ItemProvider';
import { FaShoppingBag, FaHeart, FaShareAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/currencyFormatter';
import CircularLoader from '@/components/CircularLoader';
import { Item } from '@/models/Item';
import Link from 'next/link';

const HomeProducts = () => {
  const { items, isLoading, error, addItemToCart, addItemToFavorites, isItemFavorite } = useItemContext();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineItems, setOfflineItems] = useState<Item[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial online status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Save items to localStorage when they're fetched
    if (items.length > 0) {
      localStorage.setItem('homeProducts', JSON.stringify(items.slice(0, 15)));
    }
  }, [items]);

  useEffect(() => {
    // Load items from localStorage when offline
    if (!isOnline) {
      const savedItems = localStorage.getItem('homeProducts');
      if (savedItems) {
        setOfflineItems(JSON.parse(savedItems));
      }
    }
  }, [isOnline]);

  // Filter the first 15 items to display
  const displayItems = isOnline ? items.slice(0, 15) : offlineItems;

  if (isLoading) return <CircularLoader />;
  if (error) return <p className="min-h-screen text-center text-red-500">{error}</p>;
  if (!isOnline && offlineItems.length === 0) {
    return <p className="min-h-screen text-center">You are offline and no cached products are available.</p>;
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-6 py-3 text-center text-gray-700 shadow-xl w-screen">
        Home Products
      </h1>
      {!isOnline && (
        <p className="text-center text-yellow-600 mb-4">You are currently offline. Displaying cached products.</p>
      )}
      <div className="container mx-auto px-4 py-8">
        {/* Products Grid (Responsive) */}
        <div className="layout-grid">
          {displayItems.map((item: Item) => {
            const hasOldPrice = item.oldPrice !== null && item.oldPrice !== undefined;
            const discountPercentage = hasOldPrice
              ? Math.round(((item.oldPrice! - item.price) / item.oldPrice!) * 100)
              : null;

            return (
              <Link key={item.id} href={`/item_detail/${item.id}`} passHref>
                <div
                  className="item-card"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Product Image */}
                  <div className="relative">
                    {item.label === 'promo' && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                        Promo
                      </div>
                    )}
                    {discountPercentage !== null && (
                      <div className="absolute top-2 left-2 bg-green-100 text-gray-800 text-xs px-2 py-1 rounded-lg">
                        {discountPercentage}% Off
                      </div>
                    )}
                    <img
                      src={item.itemPath}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-700 text-sm">{formatCurrency(item.price)}</p>
                      {hasOldPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {formatCurrency(item.oldPrice!)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hover Actions */}
                  {hoveredItem === item.id && (
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-10 space-x-9">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (isOnline) {
                            addItemToCart(item);
                          } else {
                            alert('You are offline. Unable to add item to cart.');
                          }
                        }}
                        className="text-white text-2xl"
                        title="Add to Cart"
                      >
                        <FaShoppingBag />
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (isOnline) {
                            addItemToFavorites(item);
                          } else {
                            alert('You are offline. Unable to add item to favorites.');
                          }
                        }}
                        className={`${
                          isItemFavorite(item) ? 'text-red-500' : 'text-white'
                        } text-2xl`}
                        title="Add to Favorites"
                      >
                        <FaHeart />
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (isOnline) {
                            navigator.share({ title: item.name, url: window.location.href });
                          } else {
                            alert('You are offline. Unable to share.');
                          }
                        }}
                        className="text-white text-2xl"
                        title="Share"
                      >
                        <FaShareAlt />
                      </button>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeProducts;