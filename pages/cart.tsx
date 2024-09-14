import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useItemContext } from '@/context/ItemProvider';
import { Item } from '@/models/Item';
import { TrashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/currencyFormatter';
import { calculateDeliveryFee } from '@/utils/deliveryFeeCalculator';
import { useUserLocation } from '@/hooks/useUserLocation';

const Cart = () => {
  const router = useRouter();
  const {
    cart,
    removeItemFromCart,
    getTotalPriceInCart,
    clearCart,
    updateCart,
  } = useItemContext();

   const { userLocation, error } = useUserLocation();

  // Calculate total delivery fee
 const totalDeliveryFee = cart.reduce((total, item) => total + (item.deliveryFee || 0), 0);

  // Calculate grand total
  const grandTotal = getTotalPriceInCart() + totalDeliveryFee;

  useEffect(() => {
  if (userLocation.location && userLocation.state) {
    const updatedCart = cart.map(async (item) => {
      if (!item.deliveryFee) {
        try {
          const fee = await calculateDeliveryFee(
            { location: item.itemLocation, state: item.state, weight: item.weight },
            1,
            userLocation
          );
          return { ...item, deliveryFee: fee };
        } catch (error) {
          console.error(`Error calculating delivery fee for item ${item.id}:`, error);
          return item;
        }
      }
      return item;
    });

    Promise.all(updatedCart).then((newCart) => {
      updateCart(newCart);
    });
  }
}, [cart, userLocation, updateCart]);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3">
            {cart.map((item: Item) => (
  <div
    key={item.id}
    className="flex items-center justify-between p-4 mb-4 bg-white shadow-md rounded-lg"
  >
    <img
      src={item.itemPath}
      alt={item.name}
      className="w-16 h-16 object-cover rounded"
    />
    <div className="ml-4 flex-1">
      <h3 className="text-lg font-medium text-gray-500">{item.name}</h3>
      <p className="text-gray-500">{formatCurrency(item.price)}</p>
      <p className="text-gray-500">
        Delivery: {item.deliveryFee !== undefined ? formatCurrency(item.deliveryFee) : 'Calculating...'}
      </p>
    </div>
    <button
      onClick={() => removeItemFromCart(item)}
      className="text-red-500 hover:text-red-700"
    >
      <TrashIcon className="h-6 w-6" />
    </button>
  </div>
))}
          </div>
          <div className="md:w-1/3 md:ml-4 mt-4 md:mt-0">
            <div className="bg-white p-4 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total Items</span>
                <span className='text-gray-500'>{cart.length}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-500">{formatCurrency(getTotalPriceInCart())}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total Delivery Fee</span>
                <span className="text-gray-500">{formatCurrency(totalDeliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-bold">Grand Total</span>
                <span className="font-bold text-gray-500">{formatCurrency(grandTotal)}</span>
              </div>
              <button
                onClick={clearCart}
                className="w-full py-2 bg-red-400 text-gray-800 font-semibold rounded-lg hover:bg-red-500"
              >
                Clear Cart
              </button>
              <button
  className="w-full text-gray-800 mt-2 py-2 bg-green-100 shadow-lg font-semibold rounded-lg hover:bg-gray-400"
  onClick={() => router.push('/shipping-info')}
>
  Checkout
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;