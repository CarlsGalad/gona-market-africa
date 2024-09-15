import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const TermsOfService: React.FC = () => {
  return (
    <Card className="max-w-4xl mx-auto text-gray-950">
      <CardHeader>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-500">Last Updated: [Insert Date]</p>
      </CardHeader>
      <CardContent>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Gona Market Africa, a leading online marketplace for small and medium-sized businesses in Nigeria. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using our services.
          </p>
          <p>
            Gona Market Africa is committed to providing a safe, secure, and reliable platform for our users to buy and sell products and services. These Terms outline the rights and responsibilities of both you, as a user, and Gona Market Africa, as the platform provider.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Our Platform</h2>
          <p className="mb-4">
            You agree to use our platform only for lawful purposes and in accordance with these Terms. You further agree to use the platform in a way that does not harm or impair our services, or interfere with any other party's use of the platform.
          </p>
          <p>
            Prohibited activities on our platform include, but are not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Engaging in any illegal or fraudulent activities</li>
            <li>Infringing on the intellectual property rights of Gona Market Africa or any third party</li>
            <li>Posting or transmitting any content that is defamatory, obscene, or offensive</li>
            <li>Attempting to gain unauthorized access to our systems or network</li>
            <li>Engaging in any activity that could disrupt or interfere with the platform's functionality</li>
          </ul>
          <p>
            Gona Market Africa reserves the right to suspend or terminate your access to the platform if we believe you have violated these terms of use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
          <p className="mb-4">
            To access certain features of our platform, you may be required to create an account. You agree to provide accurate and complete information when registering and to keep your account information up to date. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <p>
            Gona Market Africa reserves the right to suspend or terminate your account if we believe it has been used for unauthorized or illegal activities. We may also require additional verification or information from you to maintain the security and integrity of our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Purchases and Payments</h2>
          <p className="mb-4">
            All transactions made through our platform are subject to our payment processing partners' terms and conditions. By making a purchase, you agree to provide valid payment information and authorize us or our payment partners to charge your payment method for the total amount of your order, including applicable taxes and fees.
          </p>
          <p>
            Gona Market Africa does not store or have access to your payment information. All financial transactions are handled by our trusted payment partners, who are responsible for the security and privacy of your payment data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Refunds and Cancellations</h2>
          <p className="mb-4">
            Refunds or cancellations of orders are subject to our Refund Policy. We reserve the right to refuse refunds or cancellations in certain cases, such as for digital goods, perishable items, or orders that have already been fulfilled.
          </p>
          <p>
            If you are not satisfied with a purchase, please contact our customer support team within [X] days of the delivery date. We will review your request and determine if a refund or exchange is appropriate based on our Refund Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="mb-4">
            All content on the Gona Market Africa platform, including text, images, logos, and software, is the property of Gona Market Africa or its licensors. You may not use, reproduce, distribute, or display any part of the platform without our prior written consent.
          </p>
          <p>
            Gona Market Africa respects the intellectual property rights of others and expects its users to do the same. If you believe your intellectual property rights have been infringed upon, please contact us, and we will investigate the matter promptly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. User-Generated Content</h2>
          <p className="mb-4">
            By submitting content to our platform, you grant Gona Market Africa a non-exclusive, worldwide, royalty-free, and perpetual license to use, display, and distribute your content. You are solely responsible for the content you submit and must ensure that it complies with applicable laws, including the Nigerian Trade Malpractices (Miscellaneous Offences) Act, and does not infringe upon third-party rights.
          </p>
          <p>
            Gona Market Africa reserves the right to remove or modify any user-generated content that we believe violates these Terms or our Community Guidelines. We do not pre-screen or monitor all user submissions, but we may take action if we become aware of any illegal or harmful content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            To the fullest extent permitted by law, Gona Market Africa and its affiliates, partners, and employees shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the platform, even if advised of the possibility of such damages.
          </p>
          <p>
            Gona Market Africa's total liability to you for any claims related to these Terms or your use of the platform shall not exceed the amount you have paid to Gona Market Africa in the last 12 months.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to the Terms</h2>
          <p className="mb-4">
            We may update these Terms from time to time. We will notify you of any material changes by posting the updated Terms on our platform and updating the "Last Updated" date. Your continued use of our platform after such changes will constitute your acceptance of the new Terms.
          </p>
          <p>
            If you do not agree with any changes to the Terms, you may discontinue your use of the Gona Market Africa platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions. Any disputes arising out of or related to these Terms shall be resolved in the courts of Nigeria.
          </p>
          <p>
            Gona Market Africa is committed to complying with all applicable laws and regulations in Nigeria, including the Nigerian Trade Malpractices (Miscellaneous Offences) Act, the Consumer Protection Framework, and other relevant trade and consumer protection laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p className="mb-4">
            If you have any questions or concerns about these Terms, please contact us at:
          </p>
          <p className="mb-2">
            Gona Market Africa<br />
            [address to be Updated]<br />
            Email: support@gonamarketafrica.com<br />
            Phone: +234-816-2950-611
          </p>
          <p>
            Our customer support team is available [X] hours a day, [X] days a week to assist you with any inquiries or issues you may have.
          </p>
        </section>

        <div className="flex items-center mb-4">
          <Checkbox />
          <span className="ml-2">I have read and agree to the Gona Market Africa Terms of Service.</span>
        </div>
        <Button>Accept Terms</Button>
      </CardContent>
    </Card>
  );
};

export default TermsOfService;