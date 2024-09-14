import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router'; // Import useRouter
import { CategoryProvider } from '@/context/CategoriesProvider'; 
import { FirestoreService } from '@/services/FirestoreService';
import CircularLoader from '@/components/CircularLoader';

// Create an instance of FirestoreService and CategoryProvider
const firestoreService = new FirestoreService();
const categoryProvider = new CategoryProvider(firestoreService);

// MobX Observer component to reactively display categories
const CategoriesPage = observer(() => {
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // Fetch categories when the component mounts
    categoryProvider.fetchCategories();
  }, []);

  const handleCategoryClick = (id: number) => {
    router.push(`/category/${id}`); // Navigate to the category page dynamically
  };

  if (categoryProvider.isLoading) {
    return <CircularLoader/>;
  }

  return (
    <div className="container flex flex-col justify-center items-center min-h-screen mx-auto">
      <h1 className="text-3xl font-bold mb-6 w-screen text-center  shadow-xl  text-gray-900 p-4">
        Categories
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-xl justify-center items-center">
        {categoryProvider.categories.map((category) => (
          <div 
            key={category.id} 
            className="border p-4 rounded-lg shadow-md text-center cursor-pointer"
            onClick={() => handleCategoryClick(category.id)} // Handle click event
          >
            <img
              src={category.imagePath}
              alt={category.name}
              width={300}
              height={200}
              className="rounded-md mx-auto"
            />
            <h2 className="text-xl font-semibold mt-4 text-gray-600">{category.name}</h2>

            <ul className="mt-2">
              {category.subcategories.map((subcategory) => (
                <li key={subcategory.id} className="text-gray-600">
                  {subcategory.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CategoriesPage;
