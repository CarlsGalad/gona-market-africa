import { Subcategory } from './Subcategory';

export interface Category {
  id: number;
  name: string;
  imagePath: string;
  subcategories: Subcategory[];
}

export function createCategoryFromData(data: any): Category {
  return {
    id: data.id as number,
    name: data.name as string,
    imagePath: data.imagePath as string,
    subcategories: data.subcategories as Subcategory[],  // Assuming subcategories is an array of Subcategory objects
  };
}
