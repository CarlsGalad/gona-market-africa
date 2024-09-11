import React from 'react';

const CircularLoader: React.FC = () => {
  return (
     <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
  );
};

export default CircularLoader;