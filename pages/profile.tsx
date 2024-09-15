import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { NextPage } from 'next';
import ProtectedRoute from '../components/ProtectedRoute';
import { Timestamp } from 'firebase/firestore';
import { formatCurrency } from '@/utils/currencyFormatter';
import EditProfileForm from '../components/EditProfileForm';

const ProfilePage: NextPage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  if (!user) return null;

  return (
    <div className="container mx-auto p-4 text-gray-700">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-1/3">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <img 
              src={user.imagePath || '/default-avatar.png'} 
              alt="Profile" 
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-green-200"
            />
            <h2 className="text-2xl font-semibold text-center mb-4">{user.firstName} {user.lastName}</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Address:</span> {user.address || 'Not provided'}</p>
              <p><span className="font-semibold">Mobile:</span> {user.mobile || 'Not provided'}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 w-full shadow-lg bg-green-100 text-green-900 py-2 px-4 rounded hover:bg-green-200 transition duration-200"
            >
              Edit Profile
            </button>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
            {user.shippingInfos && user.shippingInfos.length > 0 ? (
              user.shippingInfos.map((info, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded">
                  <p><span className="font-semibold">Name:</span> {info.name}</p>
                  <p><span className="font-semibold">Address:</span> {info.address}, {info.city}, {info.state}</p>
                  <p><span className="font-semibold">Contact:</span> {info.contactNumber}</p>
                </div>
              ))
            ) : (
              <p>No shipping information available.</p>
            )}
          </div>
        </div>

        <div className="lg:w-2/3 mt-8 lg:mt-0">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Purchase History</h2>
            {user.purchase_history && user.purchase_history.length > 0 ? (
              <div className="overflow-x-auto rounded ">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left">Order ID</th>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.purchase_history.map((purchase, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{purchase.order_id}</td>
                          <td className="py-3 px-4">
                            {purchase.order_date instanceof Timestamp 
                              ? purchase.order_date.toDate().toLocaleString() 
                              : new Date(purchase.order_date).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">{formatCurrency(purchase.total_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p>No purchase history available.</p>
            )}
          </div>
        </div>
        
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <EditProfileForm user={user} onClose={() => setIsEditing(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute(ProfilePage);
