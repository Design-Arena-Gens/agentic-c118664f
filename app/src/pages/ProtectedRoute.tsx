import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../auth/AuthProvider';

export default function ProtectedRoute({ children, allowRole }: { children: React.ReactNode, allowRole: UserRole }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== allowRole) return <Navigate to={role === 'owner' ? '/owner' : '/renter'} replace />;
  return <>{children}</>;
}
