import React from "react";
import { useRouter } from "next/router";

const TrendingItemsBanner = () => {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to trending items page or any action
    router.push("/trending-items");
  };

  return (
    <div className="relative w-screen h-96 bg-gray-100">
      <img
        src="/background.jpeg" 
        alt="background"
        className="w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
          <h4 className="text-sm text-gray-500 uppercase">Trending</h4>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            Check out trending items
          </h1>
          <p className="mt-4 text-gray-600">
            Discover the most popular items that are catching everyone's
            attention right now. Don't miss out on the latest trends, and deals across a wide range of categories.
          </p>
          <button
            className="mt-6 bg-green-100 text-green-800 py-2 px-4 rounded-lg hover:bg-green-200"
            onClick={handleClick}
          >
            Check Trending Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingItemsBanner;
