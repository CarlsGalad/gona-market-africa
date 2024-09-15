import React, { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useUserLocation } from '../hooks/useUserLocation';
import { useItemContext } from '../context/ItemProvider';
import { FirestoreService, OrderItem, OrderStatus, ShippingInfo } from '../services/FirestoreService';
import { formatCurrency } from '@/utils/currencyFormatter';
import { useAuth } from '../context/AuthProvider';
import { Timestamp } from 'firebase/firestore';
import { SuccessAlert, FailureAlert } from '@/components/PaymentAlertComponents';


const ShippingInfoPage: NextPage = () => {
  const router = useRouter();
  const { cart, getTotalPriceInCart, getCartItemCount, clearCart } = useItemContext();
  const { user } = useAuth();
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    primaryPhoneNumber: '',
    alternativePhoneNumber: '',
    email: '',
    address: '',
  });
  const { userLocation, error: locationError } = useUserLocation();
  
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);


  const totalPrice = getTotalPriceInCart();
  const vat = totalPrice * 0.075;
  const totalDeliveryFee = cart.reduce((total, item) => total + (item.deliveryFee || 0), 0);
  const grandTotal = totalPrice + vat + totalDeliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayNow = async () => {
    if (!user) {
      alert('You must be logged in to place an order.');
      return;
    }

    try {
      const firestoreService = new FirestoreService();
      const orderId = `${Date.now()}`; // Generate a unique order ID
      const orderDate = Timestamp.fromDate(new Date());

      // Create OrderItems
      const orderItems: OrderItem[] = cart.map(item => ({
        farmId: item.farmId || '',
        itemFarm: item.itemFarm || '',
        item_id: item.id,
        item_name: item.name,
        item_price: item.price,
        order_date: orderDate,
        order_id: orderId,
        quantity: item.quantity || 1,
        status: "prepared",
        deliveryFee: item.deliveryFee || 0,
      }));

      // Create OrderStatus
      const orderStatus: OrderStatus = {
        delivered: false,
        enroute: false,
        hubNear: false,
        picked: false,
        placed: true,
        processed: false,
        shipped: false,
      };

      // Create ShippingInfo
      const shippingInfoData: ShippingInfo = {
        address: shippingInfo.address,
        city: userLocation.location || '',
        contactNumber: shippingInfo.primaryPhoneNumber,
        deliveryFee: totalDeliveryFee,
        name: shippingInfo.name,
        state: userLocation.state || '',
      };

      // Add order to Firestore
      await firestoreService.addOrder(
        user.uid,
        orderItems,
        shippingInfoData,
        grandTotal,
        orderStatus
      );

      // Increment sales count for each item
      for (const item of cart) {
        await firestoreService.incrementSalesCount(item.id);
      }
       setShowSuccessAlert(true);
      clearCart();
    } catch (error) {
      console.error('Error processing payment:', error);
      setShowFailureAlert(true);
    }
  };

  const handleSuccessAlertClose = () => {
    setShowSuccessAlert(false);
    router.push('/'); // Navigate to home page
  };
      
      
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Checkout</h1>
        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
          {/* Left: Shipping Information Form */}
          <div className="md:w-1/2 bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
            <form className="space-y-4 text-gray-700">
              {Object.entries(shippingInfo).map(([key, value]) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
             <div className="mt-4 p-3 bg-gray-50 rounded-md">
  {locationError ? (
    <p className="text-sm text-red-600">{locationError}</p>
  ) : (
    <>
      <p className="text-sm text-gray-600">State: {userLocation.state}</p>
      <p className="text-sm text-gray-600">Location (LGA): {userLocation.location}</p>
    </>
  )}
</div>
            </form>
          </div>

          {/* Right: Cart Summary */}
          <div className="md:w-1/2 bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.name}</span>
                  <div className="text-right">
                    <span className="font-medium text-gray-900 block">{formatCurrency(item.price)}</span>
                    <span className="text-sm text-gray-500 block">Delivery: {formatCurrency(item.deliveryFee || 0)}</span>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">VAT (7.5%)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(vat)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Total Delivery Fee</span>
                  <span className="font-medium text-gray-900">{formatCurrency(totalDeliveryFee)}</span>
                </div>
              </div>
              <div className="border-t pt-4 text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Grand Total</span>
                  <span className="text-lg font-bold">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePayNow}
              className="w-full bg-green-100 text-gray-800 py-3 px-4 shadow-xl rounded-md font-medium mt-6 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
       {showSuccessAlert && <SuccessAlert onClose={handleSuccessAlertClose} />}
      {showFailureAlert && <FailureAlert onClose={() => setShowFailureAlert(false)} />}
    
    </div>
  );
};

export default ProtectedRoute(ShippingInfoPage);