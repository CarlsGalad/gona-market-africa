import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFarmProvider } from '@/context/FarmProvider';
import { useItemContext } from '@/context/ItemProvider';
import { Farm } from '@/models/FarmModel';
import { Item } from '@/models/Item';
import CircularLoader from '@/components/CircularLoader';
import { formatCurrency } from '@/utils/currencyFormatter';
import { FaShoppingBag, FaHeart, FaShareAlt } from 'react-icons/fa';

interface FarmDetailPageProps {
  farmId: string;
}

const FarmDetailPage: NextPage<FarmDetailPageProps> = ({ farmId }) => {
  const { farms, loading: farmLoading, error: farmError } = useFarmProvider();
  const { items, isLoading: itemLoading, error: itemError, addItemToCart, addItemToFavorites, isItemFavorite } = useItemContext();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const [farm, setFarm] = useState<Farm | null>(null);
  const [farmItems, setFarmItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!farmLoading && !itemLoading) {
      const selectedFarm = farms.find(f => f.farmId === farmId);
      const filteredItems = items.filter(item => item.farmId === farmId);

      if (!selectedFarm) {
        setError('Farm not found');
      } else {
        setFarm(selectedFarm);
        setFarmItems(filteredItems);
      }

      setLoading(false);
    } else {
      setLoading(true);
    }

    if (farmError || itemError) {
      setError(farmError || itemError);
    }
  }, [farmId, farms, items, farmLoading, itemLoading, farmError, itemError]);

  if (loading) return <CircularLoader />;
  if (error) return <div className="text-red-500 min-h-screen">{error}</div>;
  if (!farm) return <div className='min-h-screen'>Farm not found</div>;

  return (
    <div className="min-h-screen  py4 bg-white">
      <header className='shadow-md text-center p-2 mb-4 w-full'>
        <h1 className="text-3xl font-bold text-gray-700">{farm.name}</h1>
      </header>
      <div className='mx-auto lg:p-11'>
        <div className='lg:px-36'>
      <img
        src={farm.imageUrl}
        alt={`Image of ${farm.name}`}
        width={800}
        height={400}
        className="w-full h-48 object-cover rounded-lg"
      /></div>
      <p className="text-lg mb-4  text-center text-gray-500">
        <strong className="text-2xl  text-gray-500 mb-5 ">{farm.name}</strong> - {farm.lga}, {farm.state}
      </p>
      <h2 className="text-2xl font-bold mb-5  text-gray-600 ">Items by This Farm</h2>
      <div className="layout-grid">
        {farmItems.map(item => {
          const hasOldPrice = item.oldPrice !== null && item.oldPrice !== undefined;
          const discountPercentage = hasOldPrice
            ? Math.round(((item.oldPrice! - item.price) / item.oldPrice!) * 100)
            : null;
          
          return (
 
            <Link key={item.id} href={`/item_detail/${item.id}`} passHref>
              <div className='item-card'
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}>
                
                {/* Image */}
                <div className='relative'>
                  {item.label === 'promo' && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                        Promo
                      </div>
                    )}
                    {discountPercentage !== null && (
                      <div className="absolute top-2 left-2 bg-green-100 text-gray-800 text-xs px-2 py-1 rounded-lg">
                        {discountPercentage}% Off
                      </div>
                    )}
              <img
                src={item.itemPath || '/logo_plain.png'}
                alt={`Image of ${item.name}`}
                width={500}
                height={300}
                className="w-full h-40 object-cover rounded-xl"
                  />
                </div>

              <div className="p-4">
                  <h3 className="item-name">{item.name}</h3>
                   <div className="flex items-center space-x-2">
                      <p className="text-gray-700 text-sm">{formatCurrency(item.price)}</p>
                      {hasOldPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {formatCurrency(item.oldPrice!)}
                        </p>
                      )}
                  </div>
                </div>

                {/* Hover Actions */}
                  {hoveredItem === item.id && (
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-10 space-x-9">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addItemToCart(item);
                        }}
                        className="text-white text-2xl"
                        title="Add to Cart"
                      >
                        <FaShoppingBag />
                      </button>

                      <button
                        onClick={(e) => {
                         e.preventDefault();
                          addItemToFavorites(item);
                        }}
                        className={`${
                          isItemFavorite(item) ? 'text-red-500' : 'text-white'
                        } text-2xl`}
                        title="Add to Favorites"
                      >
                        <FaHeart />
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.share({ title: item.name, url: window.location.href });
                        }}
                        className="text-white text-2xl"
                        title="Share"
                      >
                        <FaShareAlt />
                      </button>
                    </div>
                  )}
                
              </div>
            </Link>
          
          );
})}
      </div></div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      farmId: id as string,
    },
  };
};

export default FarmDetailPage;
