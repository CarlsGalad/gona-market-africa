import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FirestoreService } from '../services/FirestoreService';
import { Category } from '../models/Category';

const firestoreService = new FirestoreService();

const RandomCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOnline) {
        setError('You are currently offline. Please check your internet connection.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const allCategories = await firestoreService.fetchCategories();
        const randomCategories = allCategories
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);
        setCategories(randomCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [isOnline]);

  if (isLoading) {
    return <div className="py-4 px-8 text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="py-4 px-8 text-center text-red-500">{error}</div>;
  }

  if (categories.length === 0) {
    return <div className="py-4 px-8 text-center">No categories available.</div>;
  }

  return (
    <div className="flex justify-between gap-4 py-4 px-8 shadow-md rounded-b-md justify-items-center bg-gray-100 w-screen">
      {categories.map((category, index) => (
        <Link 
          key={`${category.id}-${index}`} 
          href={`/category/${category.id}`}
          className="px-2 cursor-pointer hover:bg-gray-100 rounded transition-colors"
        >
          <p className="text-lg font-semibold text-gray-900">{category.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default RandomCategories;