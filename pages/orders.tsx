// src/pages/orders.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import { collection, doc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import { firestore } from '../lib/firebaseConfig'; 
import ProtectedRoute from '../components/ProtectedRoute';
import CircularLoader from '@/components/CircularLoader';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (currentUserId) {
      const q = query(collection(firestore, 'orders'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userOrders = snapshot.docs
          .filter((doc) => doc.data().customer_id === currentUserId)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(userOrders);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUserId]);

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(firestore, 'orders', orderId));
    } catch (e) {
      console.error('Error deleting order: ', e);
    }
  };

  return (
      <div className="bg-white min-h-screen m">
        <header className=" text-gray-900 shadow-lg p-4">
       
        <h1 className="text-center font-semibold text-2xl">My Orders</h1>
      </header>
<main className='container mx-auto p-6 '>
      {loading ? (
       <CircularLoader/>
      ) : orders.length === 0 ? (
        <p className="text-center">You are yet to place an order.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li
              key={order.id}
              className="border p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-gray-900">Order ID: <span className="font-normal">{order.id}</span></p>
                <p className="font-bold text-gray-600">Total Amount: <span className="font-normal">₦{order.total_amount}</span></p>
              </div>
              <div className="flex items-center bg-gray-300 rounded-lg">
                <button
                  className="text-red-500 mr-2 bg-green-300 p-2 rounded-s-lg font-bold hover:bg-red-500 hover:text-white"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this order?')) {
                      deleteOrder(order.id);
                    }
                  }}
                >
                  Delete
                </button>
                <button
                  className="text-gray-900 bg-gray-300 p-2 rounded-e-lg font-bold hover:bg-green-300  hover:text-green-500"
                 onClick={() => router.push(`/order_tracking/${order.id}`)}
                >
                  Track Order
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}</main>
    </div>
  );
};

export default ProtectedRoute(OrdersPage);
