import { Role } from "@/core/constants/role.constant";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { Navigate } from "react-router";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) {
    if (user?.role?.name === Role.LABEL) return <Navigate to="/label/home" replace />;
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
};

export default GuestRoute;
