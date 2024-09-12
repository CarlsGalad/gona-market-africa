import { makeAutoObservable } from "mobx";
import { FirestoreService } from "../services/FirestoreService";
import { Category } from "../models/Category";

export class CategoryProvider {
  categories: Category[] = [];
  isLoading: boolean = false;
  private firestoreService: FirestoreService;

  constructor(firestoreService: FirestoreService) {
    makeAutoObservable(this);
    this.firestoreService = firestoreService;
  }

  async fetchCategories() {
    if (this.categories.length > 0) {
    return;  // Avoid fetching if categories are already loaded
  }
    this.isLoading = true;
    try {
      // Clear the array before fetching new categories
      this.categories = [];
      
      const fetchedCategories = await this.firestoreService.fetchCategories();
      
      // Remove duplicates by checking for unique category IDs
      const uniqueCategories = fetchedCategories.filter(
        (category, index, self) =>
          index === self.findIndex((cat) => cat.id === category.id)
      );
      
      this.categories = uniqueCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      this.isLoading = false;
    }
  }

  getSubcategoriesByCategoryName(categoryName: string) {
    const category = this.categories.find(category => category.name === categoryName);
    return category ? category.subcategories : [];
  }
}