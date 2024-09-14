import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, query, orderBy, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestore } from '@/lib/firebaseConfig';
import { Send } from 'lucide-react';

const ChatDetailScreen: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const auth = getAuth();
  const { chatId, chatTitle } = router.query;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(firestore, 'liveChats', chatId as string, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc')); // Fetch messages from oldest to newest

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === '') return;
    const user = auth.currentUser;
    if (!user || !chatId) return;

    await addDoc(collection(firestore, 'liveChats', chatId as string, 'messages'), {
      content: message.trim(),
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });

    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="py-4 px-6 shadow-lg">
        <h1 className="text-xl font-gray-800 text-center font-bold">{chatTitle}</h1>
      </header>
      <main className="flex-1 overflow-y-auto px-6 py-4 xl:mr-72 xl:ml-72">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">No messages yet</div>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg.content} isSender={msg.senderId === auth.currentUser?.uid} />
            ))}
            {/* Empty div to ensure scrolling to the bottom */}
            <div ref={messagesEndRef} />
          </ul>
        )}
      </main>
      <footer className="p-4 border-t border-gray-100">
        <div className="flex items-center max-w-3xl mx-auto">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-300 text-gray-900 h-12 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
          <button onClick={sendMessage} className="ml-2 text-green-500 hover:text-green-600 focus:outline-none">
            <Send size={24} />
          </button>
        </div>
      </footer>
    </div>
  );
};

interface ChatBubbleProps {
  message: string;
  isSender: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSender }) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-2xl max-w-xs ${isSender ? 'bg-blue-50 text-gray-800' : 'bg-gray-50 text-gray-800'}`}>
        <p className="text-lg font-normal">{message}</p>
      </div>
    </div>
  );
};

export default ChatDetailScreen;
