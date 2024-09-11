// components/ui/card.tsx
import React, { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`p-6 border-b ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};