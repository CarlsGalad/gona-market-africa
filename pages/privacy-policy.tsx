import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p>Gona Market Africa ("we", "our", or "us") is committed to protecting the privacy of our users ("you" or "your"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our agro e-commerce platform connecting farmers to consumers.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
        <p>We collect information you provide directly to us, including:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Personal identification information (Name, email address, phone number, etc.)</li>
          <li>Payment information (processed securely through Escrow Services Africa)</li>
          <li>Delivery address information</li>
          <li>Product preferences and purchase history</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Facilitate transactions between farmers and consumers</li>
          <li>Coordinate deliveries with our logistics partner, Beyond Logistics</li>
          <li>Improve our services and user experience</li>
          <li>Communicate with you about your orders and our services</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Information Sharing and Disclosure</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Farmers and consumers (only necessary transaction details)</li>
          <li>Beyond Logistics (for delivery purposes)</li>
          <li>Escrow Services Africa (for payment processing)</li>
          <li>Law enforcement or government agencies (when required by law)</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Data Protection and Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal data, in compliance with the Nigeria Data Protection Regulation (NDPR) 2019. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
        <p>Under the NDPR, you have the right to:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Access your personal data</li>
          <li>Correct inaccurate personal data</li>
          <li>Delete your personal data</li>
          <li>Restrict processing of your personal data</li>
          <li>Data portability</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">7. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p className="mt-2">
          Gona Market Africa<br />
          [address to be Updated]<br />
          Email: privacy@gonamarketafrica.com<br />
          Phone: +234-816-2950-611
        </p>
      </section>
      
      <footer className="mt-8 text-sm text-gray-600">
        <p>Last Updated: [Insert Date]</p>
        <p>This privacy policy is compliant with the Nigeria Data Protection Regulation (NDPR) 2019 and relevant Nigerian trade laws.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;