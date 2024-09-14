import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useItemContext } from '@/context/ItemProvider';
import ShimmerWidget from '@/components/ShimmerWidget';
import { formatCurrency } from '@/utils/currencyFormatter';
import { Item } from '@/models/Item';
import { FaCartPlus, FaHeart, FaShareAlt } from 'react-icons/fa';
import { calculateDeliveryFee } from '@/utils/deliveryFeeCalculator';
import { useUserLocation } from '@/hooks/useUserLocation';
import { firestore } from '@/lib/firebaseConfig';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { ManualLocationInput } from '@/components/ManualLocationInput';
import SimilarItems from '@/components/SimilarItemsProps';
import CircularLoader from '@/components/CircularLoader';

const ItemDetailPage = () => {
  const router = useRouter();
  const { itemId } = router.query;
  const { items, isLoading, addItemToCart, addItemToFavorites, isItemFavorite } = useItemContext();
  const [item, setItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const { userLocation, error: locationError } = useUserLocation();
  const [manualLocation, setManualLocation] = useState<{ location: string; state: string } | null>(null);

  const handleManualLocationSubmit = (location: string, state: string) => {
    setManualLocation({ location, state });
    localStorage.setItem('userLocation', JSON.stringify({ location, state }));
  };


  useEffect(() => {
    if (!itemId || !items.length) return;

    const fetchedItem = items.find((itm) => itm.id === itemId);
    if (fetchedItem) {
      setItem(fetchedItem);

       // Increment views in Firestore
      const incrementViews = async () => {
        try {
          const itemDocRef = doc(firestore, 'items', itemId as string);
          await updateDoc(itemDocRef, {
            views: increment(1),
          });
        } catch (error) {
          console.error('Error incrementing views:', error);
        }
      };

      incrementViews();
    }
  }, [itemId, items]);

 useEffect(() => {
    const calculateFee = async () => {
      setIsCalculatingFee(true);
      setCalculationError(null);

      const currentLocation = manualLocation || userLocation;

      // Check for missing data
      const missingData = [];
      if (!item) missingData.push('Item information');
      if (!currentLocation.location) missingData.push('User location');
      if (!currentLocation.state) missingData.push('User state');

      if (item) {
        if (!item.itemLocation) missingData.push('Item location');
        if (!item.state) missingData.push('Item state');
        if (item.weight === undefined || item.weight === null) missingData.push('Item weight');
      }

      if (missingData.length > 0) {
        console.log('Missing data for fee calculation:', missingData);
        setCalculationError(`Missing data: ${missingData.join(', ')}`);
        setIsCalculatingFee(false);
        return;
      }

     // Type guard to ensure item is not null
      if (!item) {
        setCalculationError('Item information is missing');
        setIsCalculatingFee(false);
        return;
      }

      try {
        console.log('Calculating delivery fee with:', {
          item: {
            location: item.itemLocation,
            state: item.state,
            weight: item.weight,
          },
          quantity,
          userLocation: currentLocation,
        });
        
        const fee = await calculateDeliveryFee(
          {
            location: item.itemLocation,
            state: item.state,
            weight: item.weight,
          },
          quantity,
          currentLocation
        );
        console.log('Calculated delivery fee:', fee);
        setDeliveryFee(fee);
      } catch (error) {
        console.error('Error calculating delivery fee:', error);
        setDeliveryFee(null);
        setCalculationError(getErrorMessage(error));
      } finally {
        setIsCalculatingFee(false);
      }
    };

    calculateFee();
  }, [item, quantity, userLocation, manualLocation]);

  
  // Helper function to extract error message
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  if (isLoading || !item) {
   return <CircularLoader/>;
  }

  const handleAddToCart = () => {
  if (item) {
    addItemToCart({
      ...item,
      quantity,
      price: item.price * quantity,
      deliveryFee: deliveryFee ?? undefined, // Convert null to undefined
    });
  }
};

  const handleAddToFavorites = () => {
    addItemToFavorites(item);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: item.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Share functionality is not supported on this browser.");
    }
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, item.availQuantity));
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={item.itemPath}
            alt={item.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            onError={(e) => (e.currentTarget.src = "/public/logo_plain.png")}
          />
          <div className="mt-4">
            <div className="mb-4">
             
              <p className="text-xl text-gray-900">{item.itemFarm}</p>
              <p className="text-lg text-gray-500">Location: {item.itemLocation}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(item.price * quantity, 'NGN')}
                </p>
                <p className="text-sm text-gray-500">{item.sellingMethod}</p>
              </div>
              <div className="flex items-center  text-gray-700 ">
                <button
                  onClick={decreaseQuantity}
                  className="bg-gray-200 px-3 py-1 rounded-l-2xl"
                >
                  -
                </button>
                <span className="bg-gray-100 px-4 py-1">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="bg-gray-200 px-3 py-1 rounded-r-2xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl  text-gray-900 font-bold mb-2">{item.name}</h1>
          <div className='mt-8'>
            <h2 className="text-2xl text-gray-700  font-semibold mb-4">Description</h2>
            <p className="text-gray-700 text-xl mb-6">{item.description}</p>
          </div>
          <div className='flex flex-col gap-4  text-gray-700 mt-8 '>
          <div className="bg-gray-100 p-4 rounded">
          <p className="font-semibold">Farming year:</p>
          <p>{item.farmingYear}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded ">
          <p className="font-semibold">Weight {item.sellingMethod}:</p>
          <p>{item.weight} Kg</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="font-semibold">In Stock:</p>
          <p>{item.availQuantity}</p>
        </div>
          </div>
          <div className="flex justify-between items-center mt-8">
       <button
        onClick={handleAddToCart}
        className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center"
        disabled={deliveryFee === null || isCalculatingFee}
      >
        <FaCartPlus className="mr-2" />
        {isCalculatingFee ? 'Calculating...' : 'Add to Cart'}
      </button>
        <button
          onClick={handleAddToFavorites}
          className={`text-red-500 px-6 py-3 rounded-lg flex items-center ${isItemFavorite(item) ? 'bg-red-100' : ''}`}
        >
          <FaHeart className="mr-2" />
          {isItemFavorite(item) ? 'Favorited' : 'Add to Favorites'}
        </button>
        <button
          onClick={handleShare}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center"
        >
          <FaShareAlt className="mr-2" />
          Share
        </button>
      </div>
        </div>
      </div>
     
       <div className="mt-8">
        <h2 className="text-2xl text-black font-semibold mb-4">Estimated Delivery Fee</h2>
        {isCalculatingFee ? (
          <p className="text-black">Calculating...</p>
        ) : deliveryFee !== null ? (
          <p className="text-xl text-gray-900">{formatCurrency(deliveryFee, 'NGN')}</p>
        ) : (
          <p className="text-red-500">
            {calculationError || 'Unable to calculate delivery fee'}
          </p>
        )}
        {calculationError && (
          <p className="text-sm text-gray-500 mt-2">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        )}
      </div>
      
      {(locationError || calculationError) && (
        <div className="mt-4 text-black">
          {locationError && <p className="text-red-500 mb-2">{locationError}</p>}
          <p className="text-gray-700 mb-2">Please enter your location manually:</p>
          <ManualLocationInput onLocationSubmit={handleManualLocationSubmit} />
        </div>
      )}
      <div className='text-gray-700 mb-6 mt-9'>
        <p className='text-2xl text-black font-semibold mb-4'> You may also like</p>
      <SimilarItems 
  categoryId={item.categoryId}
  subcategoryId={item.subcategoryId}
  currentItemId={item.id}
        />
       </div>
    </div>
  );
};

export default ItemDetailPage;
