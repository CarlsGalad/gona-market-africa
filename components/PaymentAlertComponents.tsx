import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/router';

// Define prop types
interface AlertProps {
  onClose: () => void; // onClose is a function that doesn't return anything
}

const SuccessAlert: React.FC<AlertProps> = ({ onClose }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
      router.push('/'); // Navigate to home page
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose, router]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
        <div className="rounded-full bg-green-100 p-3 animate-bounce">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Payment Successful!</h2>
        <p className="mt-2 text-gray-600">Your order has been placed.</p>
        <p className="mt-2 text-gray-400">Redirecting to home page...</p>
      </div>
    </div>
  );
};

const FailureAlert: React.FC<AlertProps> = ({ onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
        <div className="rounded-full bg-red-100 p-3 animate-bounce">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Payment Failed</h2>
        <p className="mt-2 text-gray-600">Please try again or contact support.</p>
      </div>
    </div>
  );
};

export { SuccessAlert, FailureAlert };
