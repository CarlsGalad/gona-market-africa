import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, query, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';  // Import your Firebase config
import NewsItemModel from '@/models/NewsItemModel';
import { UserIcon, ClockIcon } from '@heroicons/react/24/solid'
import CircularLoader from '@/components/CircularLoader';

const BlogScreen: React.FC = () => {
  const router = useRouter();
  const [newsDocs, setNewsDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(firestore, 'news'));
        const querySnapshot = await getDocs(q);
        setNewsDocs(querySnapshot.docs);
      } catch (err) {
        setError('Error fetching news: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <CircularLoader />;;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <header className="flex items-center justify-center p-4 shadow-md">
        
        <h1 className="text-xl font-bold text-center  text-gray-500">Blog</h1>
      </header>
      <ul className="p-4 space-y-4 mx-auto xl:px-40 py-8">
        {newsDocs.map((doc) => {
          const newsItem = NewsItemModel.fromMap(doc.data() as Record<string, unknown>);
          return (
            <li key={doc.id} className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="flex">
                <div className="w-47 h-44 flex-shrink-0">
                  {newsItem.image ? (
                    <img src={newsItem.image} alt={newsItem.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <i className="material-icons text-gray-500">newspaper</i>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-auto justify-center mt-9">
                  <h2 className="text-2xl font-semibold truncate  text-gray-500">{newsItem.title}</h2>
                 <div className="text-sm text-gray-500 mt-3 flex items-center space-x-2">
  <span className="flex items-center">
    <UserIcon className="w-4 h-4 text-gray-400" />
    <span>{newsItem.publisher}</span>
  </span>
  <span>•</span>
  <span className="flex items-center">
    <ClockIcon className="w-4 h-4 text-gray-400" />
    <span>{newsItem.datePublished}</span>
  </span>
</div>
                </div>
                <button
                  className=" text-gray-500 p-8"
                  onClick={() => router.push(`/blog/${doc.id}`, undefined, { shallow: true })}
                >
                  Read More
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BlogScreen;
