import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Item } from '@/models/Item';
import { FaCartPlus, FaHeart } from 'react-icons/fa';
import { formatCurrency } from '@/utils/currencyFormatter';
import { useItemContext } from '@/context/ItemProvider';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const router = useRouter();
  const { addItemToCart, addItemToFavorites, isItemFavorite } = useItemContext();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const handleItemClick = () => {
    router.push(`/item_detail/${item.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItemToCart(item);
  };

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItemToFavorites(item);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="relative">
        <img
          src={item.itemPath}
          alt={item.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => (e.currentTarget.src = "/public/logo_plain.png")}
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            className={`bg-white rounded-full p-2 shadow ${
              isItemFavorite(item) ? 'text-red-500' : 'text-gray-500'
            }`}
            onClick={handleAddToFavorites}
          >
            <FaHeart />
          </button>
          <button
            className="bg-green-500 text-white rounded-full p-2 shadow"
            onClick={handleAddToCart}
          >
            <FaCartPlus />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
        <p className="text-gray-500 truncate">{item.itemFarm}</p>
        <p className="text-green-600 font-bold">{formatCurrency(item.price, 'NGN')}</p>
      </div>
    </div>
  );
};

export default ItemCard;