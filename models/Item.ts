// models/Item.ts

export interface Item {
  id: string;
  name: string;
  price: number;
  farmId: string;
  description: string;
  sellingMethod: string;
  itemFarm: string;
  itemLocation: string;
  itemPath: string;
  categoryId: number;
  farmingYear: number;
  subcategoryId: number;
  availQuantity: number;
  weight: number;
  label?: string;
  oldPrice?: number;
  quantity?: number;
  state: string;
  views: number;
  salesCount: number;
  trendingScore: number;
  createdAt: Date;
  updatedAt: Date;
  deliveryFee?: number; // New property added
}

// Factory function to create an Item instance from a Firestore document
export function createItemFromData(data: any): Item {
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    farmId: data.farmId,
    description: data.description,
    sellingMethod: data.sellingMethod,
    itemFarm: data.itemFarm,
    itemLocation: data.itemLocation,
    itemPath: data.itemPath,
    categoryId: data.categoryId,
    farmingYear: data.farmingYear,
    subcategoryId: data.subcategoryId,
    availQuantity: data.availQuantity,
    weight: data.weight,
    quantity: data.quantity,
    label: data.label,
    oldPrice: data.oldPrice,
    state: data.state,
    views: data.views || 0,
    salesCount: data.salesCount || 0,
    trendingScore: data.trendingScore || 0, // Corrected the typo here
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    deliveryFee: data.deliveryFee || 0, // New property added with a default value of 0
  };
}
