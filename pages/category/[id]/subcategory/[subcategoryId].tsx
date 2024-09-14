import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Item } from "@/models/Item";
import { FirestoreService } from "@/services/FirestoreService";
import { useItemContext } from "@/context/ItemProvider";
import { CategoryProvider } from "@/context/CategoriesProvider";
import Link from 'next/link';
import CircularLoader from "@/components/CircularLoader";
import { formatCurrency } from "@/utils/currencyFormatter";
import { FaShoppingBag, FaHeart, FaShareAlt } from "react-icons/fa";

const SubcategoryPage = () => {
  const router = useRouter();
  const { id, subcategoryId } = router.query;

  const { items, isLoading: contextLoading, error: contextError, loadItemsFromFirestore, addItemToCart, addItemToFavorites, isItemFavorite } = useItemContext();
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const firestoreService = new FirestoreService();
  const categoryProvider = new CategoryProvider(firestoreService);

  useEffect(() => {
    const fetchData = async () => {
      if (id && subcategoryId) {
        try {
          setIsLoading(true);
          if (contextLoading) {
            await loadItemsFromFirestore();
          }
          await categoryProvider.fetchCategories();
          
          const categoryId = parseInt(id as string);
          const subCategoryId = parseInt(subcategoryId as string);

          const category = categoryProvider.categories.find(cat => cat.id === categoryId);
          if (category) {
            setCategoryName(category.name);
            const subcategory = category.subcategories.find(subcat => subcat.id === subCategoryId);
            if (subcategory) {
              setSubcategoryName(subcategory.name);
            }
          }

          const filtered = items.filter(
            (item) => item.categoryId === categoryId && item.subcategoryId === subCategoryId
          );
          setFilteredItems(filtered);
        } catch (err) {
          console.error("Error loading data:", err);
          setError("An error occurred while loading the data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id, subcategoryId, items, contextLoading]);

  if (isLoading || contextLoading) {
    return <CircularLoader/>
  }

  if (error || contextError) {
    return <p className="text-center text-red-500 mt-8 min-h-screen">{error || contextError}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-light text-gray-800 mb-2">{categoryName}</h1>
      <h2 className="text-xl font-light text-gray-600 mb-8">{subcategoryName}</h2>
      {filteredItems.length === 0 ? (
        <p className="flex text-center text-gray-600  justify-center items-center h-screen">No items found for this subcategory.</p>
      ) : (
        <div className="layout-grid">
            {filteredItems.map((item) => {
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
            )})}
        </div>
      )}
     
    </div>
  );
};

export default SubcategoryPage;