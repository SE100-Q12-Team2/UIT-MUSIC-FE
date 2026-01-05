import LoadingSpinner from "@/shared/components/common/LoadingSpinner";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // 1. Kiểm tra chế độ disable auth (cho môi trường phát triển)
  const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === "true";
  if (DISABLE_AUTH) {
    return <>{children}</>;
  }

  // 2. Hiển thị loading khi đang lấy thông tin user
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 3. Nếu chưa đăng nhập, chuyển hướng sang trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Nếu yêu cầu quyền Admin, kiểm tra Role
  if (requireAdmin) {
    // Gộp tất cả điều kiện check admin của bạn (ID = 2 hoặc tên là Admin/ADMIN)
    const isAdmin = 
      user?.roleId === 2 || 
      user?.role?.name?.toUpperCase() === "ADMIN";

    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  // 5. Nếu thỏa mãn tất cả, render nội dung bên trong
  return <>{children}</>;
};

export default ProtectedRoute;