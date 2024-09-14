import React from 'react';
import { FaLeaf, FaHandshake, FaGlobe } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 ">About Gona Market Africa</h1>
      
      <div className="max-w-3xl mx-auto">
        <p className="text-lg mb-6 text-gray-900">
          Gona Market Africa is a revolutionary e-commerce platform dedicated to transforming the agricultural landscape across the African continent. Our mission is to create a seamless connection between farms and consumers, fostering a more efficient, transparent, and sustainable food ecosystem.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          <div className="text-center text-gray-900">
            <FaLeaf className="text-green-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Fresh Products</h3>
            <p>We ensure that consumers have access to the freshest farm products directly from local producers.</p>
          </div>
          <div className="text-center text-gray-900">
            <FaHandshake className="text-blue-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fair Partnerships</h3>
            <p>We build equitable relationships between farmers and consumers, ensuring fair prices for both parties.</p>
          </div>
          <div className="text-center text-gray-900">
            <FaGlobe className="text-yellow-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sustainable Impact</h3>
            <p>Our platform promotes sustainable farming practices and reduces food waste across the supply chain.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 justify-center text-center text-gray-900">Our Vision</h2>
        <p className="mb-6 text-gray-900">
          At Gona Market Africa, we envision a future where every farmer has direct access to a vast consumer base, and every consumer can easily purchase fresh, high-quality produce straight from the source. By eliminating intermediaries, we aim to empower farmers, reduce food costs for consumers, and minimize waste in the agricultural supply chain.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">How We're Making a Difference</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-900">
          <li>Providing a user-friendly platform for farmers to showcase their products</li>
          <li>Implementing a reliable logistics network to ensure timely delivery of fresh produce</li>
          <li>Offering educational resources to help farmers adopt modern agricultural techniques</li>
          <li>Promoting transparency in food sourcing and pricing</li>
          <li>Supporting local economies by prioritizing regional agricultural development</li>
        </ul>

        <p className="text-lg font-semibold  text-gray-900 text-center mt-8">
          Join us in revolutionizing Africa's agricultural landscape - one farm, one consumer at a time.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;