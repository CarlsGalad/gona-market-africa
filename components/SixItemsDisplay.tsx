// components/SixItemsDisplay.tsx

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaShoppingBag, FaHeart, FaShareAlt } from "react-icons/fa";
import { useItemContext } from "@/context/ItemProvider"; // Adjust the import path as needed
import { Item } from "@/models/Item"; // Adjust the import path as needed

const SixItemsDisplay = () => {
  const { 
    categoryItems, 
    isCategoryItemsLoading, 
    fetchCategoryItems, 
    addItemToCart, 
    addItemToFavorites, 
    isItemFavorite 
  } = useItemContext();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoryItems();
  }, []);

  if (isCategoryItemsLoading) {
    return <div className="relative h-96 bg-cover bg-center "> </div>;
  }

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {categoryItems.map((item: Item) => {
          const hasOldPrice = item.oldPrice !== null && item.oldPrice !== undefined;
          const discountPercentage = hasOldPrice
            ? Math.round(((item.oldPrice! - item.price) / item.oldPrice!) * 100)
            : null;

          return (
            <Link key={item.id} href={`/item_detail/${item.id}`} passHref>
              <div
                className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
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
                  <h3 className="text-lg font-bold mb-2 text-gray-700">{item.name}</h3>
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
    </div>
  );
};

export default SixItemsDisplay;