// contexts/ItemContext.tsx
import { useState, useEffect, createContext, ReactNode, useContext } from "react";
import { FirestoreService } from "@/services/FirestoreService";
import { Item } from "@/models/Item";
import { getDownloadURL, ref } from "firebase/storage";
import { storage, firestore } from "@/lib/firebaseConfig"; // Ensure firestore is imported
import { doc, updateDoc, increment } from "firebase/firestore";

// Define the context interface
interface ItemContextProps {
  items: Item[];
  cart: Item[];
  favorites: Item[];
  isLoading: boolean;
  error: string | null;
  categoryItems: Item[];
  isCategoryItemsLoading: boolean;
  addItemToFavorites: (item: Item) => void;
  removeItemFromFavorites: (item: Item) => void;
  isItemFavorite: (item: Item) => boolean;
  addItemToCart: (item: Item) => Promise<boolean>;
  removeItemFromCart: (item: Item) => void;
  getCartItemCount: () => number;
  getTotalPriceInCart: () => number;
  updateCart: (newCart: Item[]) => void;
  clearCart: () => void;
  loadItemsFromFirestore: () => Promise<void>;
  searchItems: (query: string) => Item[];
  fetchCategoryItems: () => Promise<void>;
  incrementViews: (itemId: string) => void;
  incrementSalesCount: (itemId: string, quantity: number) => void; // Updated to include quantity
  updateTrendingScore: (itemId: string, points?: number) => void;
}

// Create the context
const ItemContext = createContext<ItemContextProps | undefined>(undefined);

export const ItemProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Item[]>([]);
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryItems, setCategoryItems] = useState<Item[]>([]);
  const [isCategoryItemsLoading, setIsCategoryItemsLoading] = useState<boolean>(false);

  const firestoreService = new FirestoreService();

  useEffect(() => {
    loadItemsFromFirestore();
  }, []);

  // Load items from Firestore
  const loadItemsFromFirestore = async () => {
    setIsLoading(true);
    try {
      const fetchedItems = await firestoreService.fetchItems();
      const itemsWithUrls = await Promise.all(
        fetchedItems.map(async (item) => {
          const imageRef = ref(storage, item.itemPath);
          const imageUrl = await getDownloadURL(imageRef);
          return { ...item, itemPath: imageUrl };
        })
      );
      setItems(itemsWithUrls);
    } catch (error) {
      console.error("Error fetching items from Firestore:", error);
      setError('Error fetching items from Firestore');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch category items
  const fetchCategoryItems = async () => {
    setIsCategoryItemsLoading(true);
    try {
      const fetchedItems = await firestoreService.fetchItemsByCategoryAndSubcategory([12, 7], [1]);
      setCategoryItems(fetchedItems.slice(0, 6)); // Get only 6 items (3 from each)
    } catch (error) {
      console.error("Error fetching category items:", error);
      setError('Error fetching category items');
    } finally {
      setIsCategoryItemsLoading(false);
    }
  };

  // Manage favorites
  const addItemToFavorites = (item: Item) => {
    if (!favorites.find((favorite) => favorite.id === item.id)) {
      setFavorites([...favorites, item]);
      // Optionally update trending score
      updateTrendingScore(item.id, 5); // Add 5 points for adding to favorites
    }
  };

  const removeItemFromFavorites = (item: Item) => {
    setFavorites(favorites.filter((favorite) => favorite.id !== item.id));
  };

  const isItemFavorite = (item: Item) => {
    return !!favorites.find((favorite) => favorite.id === item.id);
  };

  // Manage cart
  const addItemToCart = async (item: Item) => {
    if (!cart.find((cartItem) => cartItem.id === item.id)) {
      setCart([...cart, item]);
      // Optionally update trending score
      updateTrendingScore(item.id, 3); // Add 3 points for adding to cart
      return true;
    }
    return false;
  };

   const updateCart = (newCart: Item[]) => {
    setCart(newCart);
  };

  const removeItemFromCart = (item: Item) => {
    setCart(cart.filter((cartItem) => cartItem.id !== item.id));
  };

  const getCartItemCount = () => {
    return cart.length;
  };

  const getTotalPriceInCart = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  // Search items
  const searchItems = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    return items.filter((item) =>
      item.name.toLowerCase().includes(trimmedQuery)
    );
  };

  // Increment views
  const incrementViews = async (itemId: string) => {
    try {
      const itemDocRef = doc(firestore, 'Items', itemId);
      await updateDoc(itemDocRef, {
        views: increment(1),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  // Increment sales count
  const incrementSalesCount = async (itemId: string, quantity: number) => {
    try {
      const itemDocRef = doc(firestore, 'Items', itemId);
      await updateDoc(itemDocRef, {
        salesCount: increment(quantity),
        updatedAt: new Date(),
      });
      // Optionally update trending score
      updateTrendingScore(itemId, quantity * 10); // Add 10 points per item sold
    } catch (error) {
      console.error('Error incrementing sales count:', error);
    }
  };

  // Update trending score
  const updateTrendingScore = async (itemId: string, points: number = 1) => {
    try {
      const itemDocRef = doc(firestore, 'Items', itemId);
      await updateDoc(itemDocRef, {
        trendingScore: increment(points),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating trending score:', error);
    }
  };

  // Provide the context value
  const value = {
    items,
    cart,
    favorites,
    isLoading,
    error,
    categoryItems,
    isCategoryItemsLoading,
    addItemToFavorites,
    removeItemFromFavorites,
    isItemFavorite,
    addItemToCart,
    removeItemFromCart,
    getCartItemCount,
    getTotalPriceInCart,
    clearCart,
    loadItemsFromFirestore,
    searchItems,
    fetchCategoryItems,
    incrementViews,
     updateCart,
    incrementSalesCount,
    updateTrendingScore,
  };

  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItemContext = () => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error("useItemContext must be used within an ItemProvider");
  }
  return context;
};
