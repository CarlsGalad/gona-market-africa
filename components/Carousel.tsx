import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Item } from '@/models/Item';
import { FirestoreService } from '@/services/FirestoreService';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const Carousel: React.FC = () => {
  const [promoAndDiscountItems, setPromoAndDiscountItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const firestoreService = new FirestoreService();

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
    const fetchData = async () => {
      if (!isOnline) {
        setError('You are currently offline. Please check your internet connection.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        await firestoreService.initializeCategories();
        const items = await firestoreService.fetchPromoAndDiscountItems();
        setPromoAndDiscountItems(items);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch promotional items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOnline]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promoAndDiscountItems.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [promoAndDiscountItems.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return <p className="relative h-96 bg-cover bg-center flex items-center justify-center">Loading...</p>;
  }

  if (error) {
    return <p className="relative h-96 bg-cover bg-center flex items-center justify-center text-red-500">{error}</p>;
  }

  if (promoAndDiscountItems.length === 0) {
    return <p className="relative h-96 bg-cover bg-center flex items-center justify-center">No promotional items available.</p>;
  }

  const currentItem = promoAndDiscountItems[currentIndex];

  if (!currentItem) {
    return <p className="relative h-96 bg-cover bg-center flex items-center justify-center">Error loading item.</p>;
  }

  return (
    <div className="relative w-full h-auto">
      <div className="carousel bg-green-100">
        <div key={currentItem.id} className="carousel-item">
          <div className="relative h-96 bg-cover bg-center">
            <img
              src={currentItem.itemPath}
              alt={currentItem.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-start justify-center p-8 pr-10 text-white">
              <div className="absolute inset-0 flex flex-col items-start justify-center p-8 pr-10 text-white" style={{ left: '5%' }}>
                <h2 className="text-2xl font-bold mb-2">{currentItem.name}</h2>
                <p className={`text-3xl font-light mb-4 ${inter.className}`}>
                  {currentItem.categoryId && (
                    <>
                      Category: {firestoreService.getCategoryNameById(currentItem.categoryId)}
                    </>
                  )}
                </p>
                <Link
                  href={`/item_detail/${currentItem.id}`}
                  className="bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {promoAndDiscountItems.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-green-500' : 'bg-green-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;