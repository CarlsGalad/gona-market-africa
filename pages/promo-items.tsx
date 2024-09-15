import React, { useEffect, useState } from 'react';
import { useItemContext } from '@/context/ItemProvider';
import { FirestoreService } from '@/services/FirestoreService';
import { Item } from '@/models/Item';
import Link from 'next/link';

import { FaShoppingBag, FaHeart, FaShareAlt } from 'react-icons/fa';
import CircularLoader from '@/components/CircularLoader'; // Ensure you have this component

const PromoItems: React.FC = () => {
  const { addItemToCart, isItemFavorite, addItemToFavorites } = useItemContext();
  const [promoItems, setPromoItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Show 20 items per page
  const firestoreService = new FirestoreService();

  useEffect(() => {
    const fetchPromoItems = async () => {
      setIsLoading(true);
      try {
        await firestoreService.initializeCategories();
        const items = await firestoreService.fetchPromoAndDiscountItems();
        setPromoItems(items);
      } catch (error) {
        console.error('Error fetching promotional items:', error);
        setError('Failed to load promotional items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromoItems();
  }, []);

  const formatCurrency = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = promoItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(promoItems.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (isLoading) return <CircularLoader />;
  if (error) return <p className="min-h-screen">{error}</p>;

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-6 py-3 text-center text-gray-700 shadow-xl w-screen">
        Promotional Items
      </h1>
      <div className="container mx-auto px-4 py-8">
        <div className="layout-grid">
          {currentItems.map((item: Item) => {
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
                          addItemToCart(item);
                        }}
                        className="text-white text-2xl"
                        title="Add to Cart"
                      >
                        <FaShoppingBag />
                      </button>

                      <button
                        onClick={(e) => {
                         e.preventDefault();
                          addItemToFavorites(item);
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
                          navigator.share({ title: item.name, url: window.location.href });
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

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={handlePrevPage}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoItems;
