// src/components/ProtectedRoute.tsx
import { useAuth } from '../context/AuthProvider';
import { useRouter } from 'next/router';
import { ComponentType } from 'react';

const ProtectedRoute = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithProtection: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (typeof window !== 'undefined' && !loading) {
      if (!user) {
        router.replace('/login?redirect=' + router.pathname);
        return null;
      }

      return <WrappedComponent {...props} />;
    }

    // Show a loading state or return null if we're still loading
    return <div>Loading...</div>;
  };

  return WithProtection;
};

export default ProtectedRoute;