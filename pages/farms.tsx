import { NextPage } from 'next';
import { useRouter } from 'next/router'; // Import useRouter
import { useFarmProvider } from '@/context/FarmProvider'; 
import CircularLoader from '@/components/CircularLoader';


const FarmsPage: NextPage = () => {
  const { farms, loading, error } = useFarmProvider();
  const router = useRouter(); // Initialize useRouter

  if (loading) {
   return <CircularLoader/>;
  }

  if (error) {
    return <div className="text-red-500 min-h-screen">{error}</div>;
  }

  const handleFarmClick = (farmId: string) => {
    console.log(`Navigating to /farm/${farmId}`);
    router.push(`/farm/${farmId}`);
};

  return (
    <div className="min-h-screen p-4 lg:px-52 py-8 bg-white">
      <h1 className="text-2xl shadow-md font-bold mb-4 text-gray-600">Farms</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {farms.map((farm) => (
          <div
            key={farm.farmId}
            className="border rounded-lg overflow-hidden shadow-md cursor-pointer" // Add cursor-pointer for better UX
            onClick={() => handleFarmClick(farm.farmId)} // Add click handler
          >
            <img 
              src={farm.imageUrl} 
              alt={farm.name} 
              width={500}
              height={400}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-700">{farm.name}</h2>
              <p className="text-gray-600">{farm.lga}, {farm.state}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmsPage;
