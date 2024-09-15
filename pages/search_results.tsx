import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { formatCurrency } from '@/utils/currencyFormatter'; 
import { GoogleFonts } from 'next-google-fonts'; 
import { Item } from "@/models/Item";
import { useItemContext } from '@/context/ItemProvider';
import CircularLoader from '@/components/CircularLoader';

const SearchResultsScreen: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [sortedResults, setSortedResults] = useState<Item[]>([]);
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const query = router.query.query as string;

  const { searchItems } = useItemContext();

  const performSearch = useCallback(() => {
    if (query) {
      console.log('Searching for:', query);
      const results = searchItems(query);
      console.log('Search results:', results);
      setSearchResults(results);
      setIsLoading(false);
    }
  }, [query, searchItems]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  useEffect(() => {
    const sorted = [...searchResults].sort((a, b) => 
      ascendingOrder ? a.price - b.price : b.price - a.price
    );
    setSortedResults(sorted);
  }, [searchResults, ascendingOrder]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAscendingOrder(event.target.value === 'true');
  };

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <div className="bg-white shadow-md min-h-screen">
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Aboreto&display=swap" />
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Abel&display=swap" />
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Sansita&display=swap" />

      <header className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-600">Search Results</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-4">
          <select 
            value={ascendingOrder.toString()} 
            onChange={handleSortChange} 
            className="border p-2 rounded-2xl text-slate-700 text-lg"
          >
            <option value="true">Lowest to highest</option>
            <option value="false">Highest to lowest</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {sortedResults.map((item) => (
            <Link href={`/item_detail/${item.id}`} key={item.id} passHref>
              <div className="bg-green-50 rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={item.itemPath}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.currentTarget.src = "/public/logo_plain.png")}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-600">{item.name}</h2>
                  <p className="text-gray-600">{item.itemFarm}</p>
                  <p className="text-gray-600">{item.itemLocation}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-lg font-bold text-gray-600">{formatCurrency(item.price, 'NGN')}</span>
                    <span className="ml-auto text-gray-600">{item.sellingMethod}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SearchResultsScreen;