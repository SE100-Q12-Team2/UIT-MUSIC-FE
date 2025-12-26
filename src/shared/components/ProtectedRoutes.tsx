import LoadingSpinner from "@/shared/components/common/LoadingSpinner";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { Navigate, useLocation } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin route is required, only allow access if user is Admin
  if (requireAdmin) {
    const isAdmin = user?.roleId === 2 || user?.role?.name === 'Admin';
    if (isAdmin) {
      return <>{children}</>;
    } else {
      // User is not admin, redirect to home
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;