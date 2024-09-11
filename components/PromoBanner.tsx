import React from "react";
import { useRouter } from "next/router";

const PromoBanner = () => {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to promo and discount items page
    router.push("/promo-items");
  };

  return (
    <div className="relative w-screen h-96 bg-gray-100">
      <img
        src="/promo.jpeg"
        alt="background"
        className="w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
          <h4 className="text-sm text-gray-500 uppercase">Promotions</h4>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            Exclusive Deals & Discounts
          </h1>
          <p className="mt-4 text-gray-600">
            Save big on our latest promotions and discount offers. Explore a variety
            of items at unbeatable prices, and take advantage of these limited-time deals.
          </p>
          <button
            className="mt-6 bg-green-100 text-green-800 py-2 px-4 rounded-lg hover:bg-green-200"
            onClick={handleClick}
          >
            Shop Promo & Discount Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
