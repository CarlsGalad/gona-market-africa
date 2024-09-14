import Image from "next/image";
import { Inter } from "next/font/google";
import Carousel from "@/components/Carousel";
import NavigationRail from "@/components/NavigationRail";
import HomeProducts from "@/components/HomeProducts";
import TrendingItemsBanner from "@/components/TrendingItemsBanner";
import SixItemsDisplay from "@/components/SixItemsDisplay";
import PromoBanner from "@/components/PromoBanner";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
       className={`flex min-h-screen flex-col bg-gray-50 items-center text-black w-full overflow-x-hidden ${inter.className}`}
    >
      <Carousel />
      <NavigationRail />
      <HomeProducts />
      <TrendingItemsBanner />
      <SixItemsDisplay />
      <PromoBanner/>
    </main>
  );
}
