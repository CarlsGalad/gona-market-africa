import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebaseConfig';
import CircularLoader from '@/components/CircularLoader';

const ChatListScreen: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const chatQuery = query(
      collection(firestore, 'liveChats'),
      where('senderId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const createNewChat = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const chatData = {
      title: 'Chat with Admin',
      senderName: user.displayName || 'Anonymous',
      senderId: user.uid,
      adminId: 'live_chat',
      timestamp: serverTimestamp(),
    };

    const newChat = await addDoc(collection(firestore, 'liveChats'), chatData);
    router.push(`/chat/${newChat.id}?chatTitle=${encodeURIComponent(chatData.title)}`);
  };

  if (loading) {
   return <CircularLoader/>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Live Chat List</h1>
          <div className="border-t border-gray-200 pt-4">
            {chats.length === 0 ? (
              <div className="text-center text-gray-600">No chats available</div>
            ) : (
              <ul>
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100"
                    onClick={() => router.push(`/chat/${chat.id}?chatTitle=${encodeURIComponent(chat.title)}`)}
                  >
                    <h2 className="text-xl font-bold  text-gray-900">{chat.title}</h2>
                    <p className="text-gray-600">{chat.senderName}</p>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <button
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg"
        onClick={createNewChat}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.75v14.5m7.25-7.25H4.75"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatListScreen;
