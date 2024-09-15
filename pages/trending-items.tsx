import { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebaseConfig';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { formatCurrency } from '@/utils/currencyFormatter';
import { FaCartPlus } from 'react-icons/fa';
import { Item } from '@/models/Item';
import { useItemContext } from '@/context/ItemProvider';
import ShimmerWidget from '@/components/ShimmerWidget';
import Link from 'next/link';
import CircularLoader from '@/components/CircularLoader';

const TrendingItems = () => {
  const [trendingItems, setTrendingItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItemToCart } = useItemContext();

  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        const itemsRef = collection(firestore, 'items');
        const trendingQuery = query(
          itemsRef,
          where('trendingScore', '>', 0),
          orderBy('trendingScore', 'desc'),
          limit(10)
        );
        const snapshot = await getDocs(trendingQuery);
        const itemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Item[];
        setTrendingItems(itemsData);
      } catch (error) {
        console.error('Error fetching trending items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingItems();
  }, []);

  if (isLoading) {
   return <CircularLoader/>;
  }

  if (trendingItems.length === 0) {
    return <p className="text-center text-xl text-gray-500 min-h-screen">No trending items available.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Trending Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {trendingItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 bg-white shadow-lg">
            <Link href={`/items/${item.id}`} passHref>
              <a>
                <img
                  src={item.itemPath}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-500">From: {item.itemFarm}</p>
                <p className="text-green-600 font-bold">
                  {formatCurrency(item.price, 'NGN')}
                </p>
              </a>
            </Link>
            <button
              onClick={() => addItemToCart({ ...item, quantity: 1 })}
              className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-lg flex justify-center items-center"
            >
              <FaCartPlus className="mr-2" /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingItems;
