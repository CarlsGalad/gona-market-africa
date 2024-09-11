import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaUser, FaShoppingCart, FaBars, FaSearch, FaTimes, FaHome, FaBlog, FaInfo, FaPeopleCarry } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useItemContext } from '@/context/ItemProvider';
import RandomCategories from './RandomCategories';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { searchItems, getCartItemCount } = useItemContext();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchResults = searchItems(searchQuery);
    console.log('Search results:', searchResults);
    router.push(`/search_results?query=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const DrawerContent = () => (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
         style={{ transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
      <div className="p-4 px-6">
        <button onClick={toggleDrawer} className="mb-4 text-gray-900">
          <FaTimes size={24} />
        </button>
        <nav className="flex flex-col space-y-8 text-gray-900 mt-7 text-lg">
          <Link href="/" className="flex items-center space-x-2 marker:hover:text-gray-600 ">
            <FaHome size={20} />
            <span> Home</span> </Link>
          <Link href={`/category/12`} className="flex items-center space-x-2 hover:text-gray-600">  <FaUser size={20} />
            <span>Meat</span>
          </Link>
          <Link href="/farms" className="flex items-center space-x-2 hover:text-gray-600">
            <FaPeopleCarry size={20} />
            <span>Farms</span></Link>
          <Link href="/about" className="flex items-center space-x-2 hover:text-gray-600">
            <FaInfo size={20} />
            <span>About</span></Link>
          <Link href="/blog" className="flex items-center space-x-2 hover:text-gray-600">
            <FaBlog size={20} />
            <span>Blog</span>
          </Link>
        </nav>
        <div className="mt-8 text-gray-900">
          <Link href="/profile" className="flex items-center space-x-2">
            <FaUser size={20} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <header className="bg-white shadow-md w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button onClick={toggleDrawer} className="text-gray-900">
                <FaBars size={24} />
              </button>
            )}
            <Image src="/logo_plain.png" width={80} height={80} alt="Logo" priority className="w-16 h-16 md:w-20 md:h-20" />
            <div className="text-lg md:text-xl font-bold text-gray-900">
              <Link href="/">Gona Market Africa</Link>
            </div>
          </div>

          {!isMobile && (
            <nav className="hidden lg:flex space-x-6 text-gray-900">
              <Link href="/" className="hover:text-gray-600">Home</Link>
              <Link href={`/category/12`} className="hover:text-gray-600">Meat</Link>
              <Link href="/farms" className="hover:text-gray-600">Farms</Link>
              <Link href="/about" className="hover:text-gray-600">About</Link>
              <Link href="/blog" className="hover:text-gray-600">Blog</Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {isMobile ? (
              <button onClick={toggleSearch} className="text-gray-900">
                <FaSearch size={20} />
              </button>
            ) : (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 h-10 p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-900"
                  placeholder="Search..."
                />
              </form>
            )}
            {!isMobile && (
              <Link href="/profile" className="text-gray-900">
                <FaUser size={20} />
              </Link>
            )}
            <Link href="/cart" className="relative text-gray-900">
              <div>
                <FaShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5">
                  {getCartItemCount()}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {isMobile && isSearchOpen && (
          <form onSubmit={handleSearch} className="mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-900"
              placeholder="Search..."
            />
          </form>
        )}
      </div>

      {!isMobile && (
        <div className="container">
          <RandomCategories />
        </div>
      )}

      <DrawerContent />
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleDrawer}></div>
      )}
    </header>
  );
};

export default Header;