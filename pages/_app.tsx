import "@/styles/globals.css";
import Header from '../components/Header'; 
import '../components/ShimmerWidget.css';
import type { AppProps } from "next/app";
import { ItemProvider } from '@/context/ItemProvider';
import { FarmProvider } from '@/context/FarmProvider';
import { AuthProvider } from "@/context/AuthProvider";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <FarmProvider>
        <ItemProvider>
          <Header />
          <main className="bg-white ">
            <Component {...pageProps} />
          </main>
          <Footer/>
          {/* Optionally, you can add a Footer component here */}
        </ItemProvider>
      </FarmProvider>
    </AuthProvider>
  );
}