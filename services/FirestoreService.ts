import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  Timestamp,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import { Item, createItemFromData } from "../models/Item";
import { Category, createCategoryFromData } from '../models/Category';

// Interfaces
interface Order {
  customer_id: string;
  orderItems: OrderItem[];
  orderStatus: OrderStatus;
  shipping_info: ShippingInfo;
  total_amount: number;
  order_date: Timestamp;
  order_id: string;
  processedDate: Timestamp;
}

export interface OrderItem {
  farmId: string;
  itemFarm: string;
  item_id: string;
  item_name: string;
  item_price: number;
  order_date: Timestamp;
  order_id: string;
  quantity: number;
  status: string;
  deliveryFee: number;
}

export interface OrderStatus {
  delivered: boolean;
  enroute: boolean;
  hubNear: boolean;
  picked: boolean;
  placed: boolean;
  processed: boolean;
  shipped: boolean;
}

export interface ShippingInfo {
  address: string;
  city: string;
  contactNumber: string;
  deliveryFee: number;
  name: string;
  state: string;
}

export class FirestoreService {
  private itemsCollectionName = 'Items';
  private categoriesCollectionName = 'Category';
  private categories: Category[] = [];

  // Fetch all items
  async fetchItems(): Promise<Item[]> {
    const itemsCollectionRef = collection(firestore, this.itemsCollectionName);
    const itemsQuery = query(itemsCollectionRef);
    const querySnapshot = await getDocs(itemsQuery);
    
    return querySnapshot.docs.map(doc => createItemFromData(doc.data()));
  }

  // Initialize categories if not already initialized
  async initializeCategories(): Promise<void> {
    if (this.categories.length === 0) {
      this.categories = await this.fetchCategories();
    }
  }

  // Fetch promo and discounted items
  async fetchPromoAndDiscountItems(): Promise<Item[]> {
    const itemsCollectionRef = collection(firestore, this.itemsCollectionName);
    const promoQuery = query(
      itemsCollectionRef,
      where("oldPrice", ">", 0),
      where("label", "==", "promo")
    );
    const querySnapshot = await getDocs(promoQuery);
    
    return querySnapshot.docs.map(doc => createItemFromData(doc.data()));
  }

  // Fetch a single item by ID
  async getItemById(id: string): Promise<Item | null> {
    try {
      const itemDocRef = doc(firestore, this.itemsCollectionName, id);
      const itemDoc = await getDoc(itemDocRef);
      
      return itemDoc.exists() ? createItemFromData(itemDoc.data()) : null;
    } catch (error) {
      console.error('Error fetching item by ID:', error);
      return null;
    }
  }

  // Fetch all categories
  async fetchCategories(): Promise<Category[]> {
    if (this.categories.length > 0) return this.categories;

    const categoriesCollectionRef = collection(firestore, this.categoriesCollectionName);
    const categoriesQuery = query(categoriesCollectionRef);
    const querySnapshot = await getDocs(categoriesQuery);
    
    this.categories = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const categoryData = doc.data();
        const subcategoriesSnapshot = await getDocs(collection(doc.ref, 'Subcategories'));
        const subcategories = subcategoriesSnapshot.docs.map(subcatDoc => ({
          id: subcatDoc.data().id as number,
          name: subcatDoc.data().name as string,
        }));
        
        return createCategoryFromData({ ...categoryData, subcategories });
      })
    );

    return this.categories;
  }

  // Get category name by ID
  getCategoryNameById(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  }

  // Fetch items by category and subcategory
  async fetchItemsByCategoryAndSubcategory(
    categoryIds: number[],
    subcategoryIds: number[]
  ): Promise<Item[]> {
    const itemsCollectionRef = collection(firestore, this.itemsCollectionName);
    const itemsQuery = query(
      itemsCollectionRef,
      where("categoryId", "in", categoryIds),
      where("subcategoryId", "in", subcategoryIds)
    );
    
    const querySnapshot = await getDocs(itemsQuery);
    return querySnapshot.docs.map(doc => createItemFromData(doc.data()));
  }

  // Increment sales count for a specific item
  async incrementSalesCount(itemId: string): Promise<void> {
    const itemDocRef = doc(firestore, this.itemsCollectionName, itemId);
    const itemDoc = await getDoc(itemDocRef);

    if (itemDoc.exists()) {
      const salesCount = itemDoc.data().salesCount || 0;
      await updateDoc(itemDocRef, { salesCount: salesCount + 1 });
    } else {
      await setDoc(itemDocRef, { salesCount: 1 }, { merge: true });
    }
  }

  // Add an order to Firestore
  async addOrder(
    customer_id: string,
    orderItems: OrderItem[],
    shippingInfo: ShippingInfo,
    total_amount: number,
    orderStatus: OrderStatus
  ): Promise<void> {
    const orderId = `${Date.now()}`;
    const orderDate = Timestamp.fromDate(new Date());

    const orderData: Order = {
      customer_id,
      orderItems,
      orderStatus,
      shipping_info: shippingInfo,
      total_amount,
      order_date: orderDate,
      order_id: orderId,
      processedDate: orderDate,
    };

    const orderDocRef = doc(firestore, "orders", orderId);
    await setDoc(orderDocRef, orderData);

    for (const item of orderItems) {
      const orderItemDocRef = doc(firestore, "orderItems", `${orderId}_${item.item_id}`);
      await setDoc(orderItemDocRef, {
        ...item,
        order_date: orderDate,
        order_id: orderId,
        status: "prepared",
      });
    }

    await this.updateCustomerPurchaseHistory(customer_id, orderId, total_amount, orderItems, orderDate);
  }

  // Update customer's purchase history
  private async updateCustomerPurchaseHistory(
    customer_id: string,
    order_id: string,
    total_amount: number,
    orderItems: OrderItem[],
    order_date: Timestamp
  ): Promise<void> {
    const customerDocRef = doc(firestore, "users", customer_id);
    const customerDoc = await getDoc(customerDocRef);

    const purchaseData = {
      order_date,
      order_id,
      total_amount,
      items: orderItems.map(item => item.item_name),
    };

    if (customerDoc.exists()) {
      const customerData = customerDoc.data();
      if (customerData?.purchase_history) {
        await updateDoc(customerDocRef, {
          purchase_history: arrayUnion(purchaseData),
        });
      } else {
        await updateDoc(customerDocRef, {
          purchase_history: [purchaseData],
        });
      }
    }
  }
}
