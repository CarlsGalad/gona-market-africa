//pages/CategoryDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { useItemContext } from '@/context/ItemProvider'; 
import { CategoryProvider } from '@/context/CategoriesProvider'; 
import { FirestoreService } from '../services/FirestoreService';
import { Item } from '../models/Item';
import Link from 'next/link';
import CircularLoader from '@/components/CircularLoader';

const firestoreService = new FirestoreService();
const categoryProvider = new CategoryProvider(firestoreService);

const CategoryDetailPage: React.FC = observer(() => {
  const router = useRouter();
  const { id } = router.query;
  const { items, isLoading: itemsLoading, addItemToCart, isItemFavorite, addItemToFavorites, removeItemFromFavorites } = useItemContext();
  const [categoryItems, setCategoryItems] = useState<Item[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
   const fetchCategoryData = async () => {
  if (typeof id === 'string') { // Ensure id is a string
    await categoryProvider.fetchCategories();
    const category = categoryProvider.categories.find(cat => cat.id === Number(id)); // Convert id to number
    if (category) {
      setCategoryName(category.name);
      const filteredItems = items.filter(item => item.categoryId === Number(id)); // Convert id to number
      setCategoryItems(filteredItems);
    }
  }
};

    fetchCategoryData();
  }, [id, items]);

  const handleAddToCart = async (item: Item) => {
    const added = await addItemToCart(item);
    if (added) {
      alert('Item added to cart!');
    } else {
      alert('Item is already in the cart.');
    }
  };

  const handleToggleFavorite = (item: Item) => {
    if (isItemFavorite(item)) {
      removeItemFromFavorites(item);
    } else {
      addItemToFavorites(item);
    }
  };

  if (itemsLoading || categoryProvider.isLoading) {
   return <CircularLoader/>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryItems.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.itemPath} alt={item.name} className="w-full h-48 object-cover mb-4 rounded" />
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-2">${item.price.toFixed(2)}</p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleToggleFavorite(item)}
                className={`${
                  isItemFavorite(item) ? 'text-red-500' : 'text-gray-500'
                } hover:text-red-500`}
              >
                ♥
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
});

export default CategoryDetailPage;