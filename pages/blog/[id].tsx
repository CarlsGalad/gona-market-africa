import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, getDocs, orderBy, startAfter, endBefore, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';
import NewsItemModel from '../../models/NewsItemModel';
import { UserIcon, ClockIcon } from '@heroicons/react/24/solid';
import CircularLoader from '@/components/CircularLoader';


const BlogDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [newsItem, setNewsItem] = useState<NewsItemModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousPost, setPreviousPost] = useState<NewsItemModel | null>(null);
  const [nextPost, setNextPost] = useState<NewsItemModel | null>(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) return;

      try {
        // Fetch current post
        const docRef = doc(firestore, 'news', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const currentNewsItem = NewsItemModel.fromMap(docSnap.data() as Record<string, unknown>);
          setNewsItem(currentNewsItem);

          // Fetch all news items ordered by date
          const newsQuery = query(collection(firestore, 'news'), orderBy('date_published'));
          const newsSnapshots = await getDocs(newsQuery);
          const allNews = newsSnapshots.docs.map((doc) =>
            NewsItemModel.fromMap(doc.data() as Record<string, unknown>)
          );

          // Find the index of the current post based on its datePublished
          const currentIndex = allNews.findIndex((item) => item.datePublished === currentNewsItem.datePublished);

          // Determine previous and next posts
          if (currentIndex > 0) {
            setPreviousPost(allNews[currentIndex - 1]);
          }

          if (currentIndex < allNews.length - 1) {
            setNextPost(allNews[currentIndex + 1]);
          }
        } else {
          setError('No such document!');
        }
      } catch (err) {
        setError('Error fetching document: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);
    
const renderContent = (content: string) => {
    // Split content into parts
    const firstWordEndIndex = content.indexOf(' ');
    const firstWord = content.substring(0, firstWordEndIndex);
    const remainingContent = content.substring(firstWordEndIndex).trim();

    // Use dangerouslySetInnerHTML for HTML content rendering
    return (
      <div>
        <span className="text-3xl font-bold">{firstWord} </span>
        <span className="text-xl">{remainingContent}</span>
      </div>
    );
  };

  if (loading) {
    return <CircularLoader />;;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  if (!newsItem) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">No news item found</div>;
  }

  const handlePreviousClick = () => {
    if (previousPost) {
      router.push(`/blog/${previousPost.datePublished}`); // Change this to actual route if needed
    }
  };

  const handleNextClick = () => {
       if (nextPost) {
      router.push(`/blog/${nextPost.datePublished}`); // Change this to actual route if needed
    }
  };

  return (
    <div className="min-h-screen p-4 lg:px-52 py-8">
      <h1 className="text-4xl font-bold mb-4 text-gray-700">{newsItem.title}</h1>
      <div className="flex text-sm text-gray-500 mb-4 ">
        <span className="flex items-center gap-2 item">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <span>{newsItem.publisher}</span>
        </span>
        <span className="mx-2">•</span>
        <span className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-400 " />
          <span>{newsItem.datePublished}</span>
        </span>
      </div>
      <img 
  src={newsItem.image} 
  alt={newsItem.title} 
  className="w-full lg:max-h-[600px] object-cover mb-4 rounded-md"
/>
      <div className="text-lg text-gray-700">
        {renderContent(newsItem.content)}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePreviousClick}
          className={`p-2 text-white ${previousPost ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
          disabled={!previousPost}
        >
          Previous
        </button>
        <button
          onClick={handleNextClick}
          className={`p-2 text-white ${nextPost ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
          disabled={!nextPost}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;

