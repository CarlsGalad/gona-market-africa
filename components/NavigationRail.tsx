import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavigationRail: React.FC = () => {
  const router = useRouter();

  const categories = [
    { name: 'Fresh Milk', id: 2, subcategoryId: 1 },
    { name: 'Herbal Teas', id: 1, subcategoryId: 1 },
    { name: 'Chicken', id: 12, subcategoryId: 1 },
    { name: 'Fertilizers', id: 13, subcategoryId: 1 },
  ];

  return (
    <nav className="bg-gray-300 shadow-sm py-4 items-center w-screen">
      <div className="max-w-7xl mx-auto flex items-center justify-between md:px-32">
        <div className="flex space-x-4">
          <Link href="/feature-products" className={`py-2 px-4 text-xl font-serif font-semibold rounded-lg text-gray-700 hover:text-white ${router.pathname === '/categories/feature-products' ? 'bg-green-500 text-white' : ''}`}>
            Feature Products
          </Link>
        </div>
        <div className="flex space-x-4 ">
          <nav className='mt-2'>
      {categories.map((category) => (
        <Link 
          key={category.name}
          href={`/category/${category.id}/subcategory/${category.subcategoryId}`}
          className={`py-2 px-4 mt-2 rounded-lg text-gray-700 hover:text-white ${
            router.asPath === `/category/${category.id}/subcategory/${category.subcategoryId}` 
              ? 'bg-green-500 text-white' 
              : ''
          }`}
        >
          {category.name}
        </Link>
      ))}
    </nav>
          <Link href="/categories" className=" bg-green-100 text-green-800 py-2 px-4 rounded-lg hover:bg-green-200">
            See All Categories
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationRail;