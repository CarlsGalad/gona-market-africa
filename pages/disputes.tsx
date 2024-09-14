import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {  firestore } from '@/lib/firebaseConfig';
import { useAuth } from '../context/AuthProvider';// Assuming you have a custom hook for Firebase Auth
 // Assuming you have a firebase.js file that exports the Firestore instance
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const Disputes: React.FC = () => {
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useAuth(); // Custom hook to get the current authenticated user
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    try {
      await addDoc(collection(firestore, 'disputes'), {
        userId: user.uid,
        description: description.trim(),
        category: selectedCategory,
        status: 'Pending',
        timestamp: serverTimestamp(),
      });

      setDescription('');
      setSelectedCategory(null);

      alert('Dispute reported successfully');
      router.push('/'); // Redirect to homepage or another page
    } catch (error) {
      console.error('Error submitting dispute: ', error);
      alert('Failed to submit dispute');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <header className=" text-gray-900 shadow-lg p-4">
       
        <h1 className="text-center font-semibold text-2xl">Report a Dispute</h1>
      </header>
      <main className="flex-grow p-6 text-gray-700 ">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-gray-700 mb-2 text-2xl">Category</h3>
            <div className="flex space-x-4 text-xl">
              {['Billing', 'Service', 'Delayed Delivery', 'Other'].map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="form-radio"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
            {!selectedCategory && (
              <p className="text-red-500 mt-2">Please select a category</p>
            )}
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <label className="block text-gray-700  text-2xl mb-2">Description</label>
            <textarea
              className="w-full p-2 rounded-xl border border-gray-300 text-xl"
              rows={5}
              maxLength={400}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-2xl bg-green-100 shadow-lg hover:bg-slate-300 text-gray-900 rounded-lg font-bold"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default Disputes;
