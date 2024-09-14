import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { DocumentData, getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { OrderTracker, TextDto, Status } from '@/components/order-tracker-package';
import { app } from '@/lib/firebaseConfig';
import CircularLoader from '@/components/CircularLoader';

interface OrderTrackingProps {
  orderId: string;
}

const OrderTrackingPage: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const [orderData, setOrderData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const firestore = getFirestore(app);
        const orderDocRef = doc(collection(firestore, 'orders'), orderId);
        const orderDoc = await getDoc(orderDocRef);

        if (orderDoc.exists()) {
          setOrderData(orderDoc.data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatDate = (timestamp: any) => {
    if (timestamp?.toDate) {
      return format(timestamp.toDate(), 'MMM dd, yyyy HH:mm');
    }
    return '';
  };

  if (isLoading) {
   return <CircularLoader/>;
  }

  if (!orderData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-2xl font-light text-gray-600">No data found</div>
      </div>
    );
  }

  const currentStatus = orderData.orderStatus || {};
  console.log('Current Status:', currentStatus);

  const orderDate = formatDate(orderData.order_date);
  const processedDate = formatDate(orderData.processedDate);
  const pickedDate = formatDate(orderData.pickedDate);
  const shippedDate = formatDate(orderData.shippedDate);
  const hubDate = formatDate(orderData.hubDate);
  const enrouteDate = formatDate(orderData.enrouteDate);
  const deliveryDate = formatDate(orderData.deliveryDate);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Order Tracking</h1>
          <div className="border-t border-gray-200 pt-4">
            <OrderTracker
              headingDateTextStyle={{ color: '#6B7280', fontSize: '0.875rem' }}
              headingTitleStyle={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}
              subTitleTextStyle={{ fontSize: '1rem', fontWeight: '500', color: '#374151' }}
              subDateTextStyle={{ color: '#6B7280', fontSize: '0.875rem' }}
              status={
                currentStatus.delivered
                  ? Status.Delivered
                  : currentStatus.enroute
                  ? Status.Enroute
                  : currentStatus.hubNear
                  ? Status.HubNear
                  : currentStatus.shipped
                  ? Status.Shipped
                  : currentStatus.picked
                  ? Status.Picked
                  : currentStatus.processed
                  ? Status.Processed
                  : currentStatus.placed
                  ? Status.Order
                  : Status.Order // Default status
              }
              activeColor="#10B981"
              inActiveColor="#D1D5DB"
              orderTitleAndDateList={
                currentStatus.placed
                  ? [new TextDto('Order Placed', orderDate)]
                  : []
              }
              shippedTitleAndDateList={
                currentStatus.processed
                  ? [new TextDto('Order Processed', processedDate)]
                  : currentStatus.shipped
                  ? [new TextDto('Order Shipped', shippedDate)]
                  : currentStatus.hubNear
                  ? [new TextDto('Arrived at Nearest Hub', hubDate)]
                  : []
              }
              outOfDeliveryTitleAndDateList={
                currentStatus.enroute
                  ? [new TextDto('Out for Delivery', enrouteDate)]
                  : []
              }
              deliveredTitleAndDateList={
                currentStatus.delivered
                  ? [new TextDto('Order Delivered', deliveryDate)]
                  : []
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { orderId } = context.params as { orderId: string };
  return { props: { orderId } };
};

export default OrderTrackingPage;
