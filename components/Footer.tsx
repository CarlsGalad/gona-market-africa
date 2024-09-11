// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 px-3">
      <div className="container mx-auto flex flex-wrap justify-between">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <h5 className="text-lg font-semibold mb-2 ">Customer Service</h5>
          <ul>
            <li className="mb-1">
              <Link href="/disputes" className="hover:underline">
                Disputes
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/customer-care" className="hover:underline">
                Customer Care
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/orders" className="hover:underline">
                Order Tracking
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/feedbacks" className="hover:underline">
                Feedback & Suggestions
              </Link>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <h5 className="text-lg font-semibold mb-2">About Us</h5>
          <ul>
            <li className="mb-1">
              <Link href="/about" className="hover:underline">
                Our Story
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/terms-of-service" className="hover:underline">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/3">
          <h5 className="text-lg font-semibold mb-2">Follow Us</h5>
          <ul>
            <li className="mb-1">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Facebook
              </a>
            </li>
            <li className="mb-1">
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Twitter
              </a>
            </li>
            <li className="mb-1">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-6 border-t border-gray-700 pt-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Gona Market Africa. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
