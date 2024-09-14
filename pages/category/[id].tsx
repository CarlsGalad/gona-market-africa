import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { useItemContext } from '@/context/ItemProvider'; 
import { CategoryProvider } from '@/context/CategoriesProvider'; 
import { FirestoreService } from '@/services/FirestoreService';
import { Item } from '@/models/Item'; 
import { Subcategory } from '@/models/Subcategory';
import Link from 'next/link';
import { formatCurrency } from '@/utils/currencyFormatter'; 
import CircularLoader from '@/components/CircularLoader';
import { FaHeart, FaShareAlt, FaShoppingBag } from 'react-icons/fa';

const firestoreService = new FirestoreService();
const categoryProvider = new CategoryProvider(firestoreService);

type PriceSortOption = 'price-asc' | 'price-desc' | 'none';

const CategoryDetailPage: React.FC = observer(() => {
  const router = useRouter();
  const { id } = router.query;
  const { items, isLoading: itemsLoading, addItemToCart, isItemFavorite, addItemToFavorites, removeItemFromFavorites } = useItemContext();
  const [categoryItems, setCategoryItems] = useState<Item[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [priceSortOption, setPriceSortOption] = useState<PriceSortOption>('none');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | 'all'>('all');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (typeof id === 'string') {
        await categoryProvider.fetchCategories();
        const category = categoryProvider.categories.find(cat => cat.id === Number(id));
        if (category) {
          setCategoryName(category.name);
          setSubcategories(category.subcategories || []);
          const filteredItems = items.filter(item => item.categoryId === Number(id));
          setCategoryItems(filteredItems);
        }
      }
    };

    fetchCategoryData();
  }, [id, items]);

  const filteredAndSortedItems = useMemo(() => {
    let result = [...categoryItems];

    // Apply subcategory filter
    if (selectedSubcategoryId !== 'all') {
      result = result.filter(item => item.subcategoryId === selectedSubcategoryId);
    }

    // Apply price sorting
    switch (priceSortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      // 'none' case doesn't need sorting
    }

    return result;
  }, [categoryItems, selectedSubcategoryId, priceSortOption]);

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

  const handlePriceSort = (option: PriceSortOption) => {
    setPriceSortOption(option);
  };

  const handleSubcategoryFilter = (subcategoryId: number | 'all') => {
    setSelectedSubcategoryId(subcategoryId);
  };

  if (itemsLoading || categoryProvider.isLoading) {
    return <CircularLoader />;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{categoryName}</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label htmlFor="priceSort" className="mr-2 text-gray-900">Sort by price:</label>
          <select
            id="priceSort"
            value={priceSortOption}
            onChange={(e) => handlePriceSort(e.target.value as PriceSortOption)}
            className="border rounded-full p-2 text-gray-900"
          >
            <option value="none">No sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <div>
          <label htmlFor="subcategoryFilter" className="mr-2 text-gray-900">Filter by subcategory:</label>
          <select
            id="subcategoryFilter"
            value={selectedSubcategoryId}
            onChange={(e) => handleSubcategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="border rounded-full p-2 text-gray-900"
          >
            <option value="all">All Subcategories</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="layout-grid">

        {filteredAndSortedItems.map((item) => {
          const hasOldPrice = item.oldPrice !== null && item.oldPrice !== undefined;
          const discountPercentage = hasOldPrice
            ? Math.round(((item.oldPrice! - item.price) / item.oldPrice!) * 100)
            : null;
          return (
            <Link href={`/item_detail/${item.id}`} key={item.id} passHref>

              <div className="item-card"
               onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Product Image */}
                <div className='relative'>
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
                    className="w-full h-48 object-cover rounded" />
                </div>

                {/* Details */}
              <div className='p-4'>
                <h3 className="item-name">{item.name}</h3>
                <div className="flex items-center space-x-2">
                      <p className="text-gray-700 text-sm">{formatCurrency(item.price)}</p>
                      {hasOldPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {formatCurrency(item.oldPrice!)}
                        </p>
                      )}
                  </div>
                <p className="text-sm text-gray-500 mb-2">
                  {subcategories.find(sub => sub.id === item.subcategoryId)?.name || 'N/A'}
                </p>
                </div>
                

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
          )
        })}
      </div>
     
    </div>
  );
});

export default CategoryDetailPage;