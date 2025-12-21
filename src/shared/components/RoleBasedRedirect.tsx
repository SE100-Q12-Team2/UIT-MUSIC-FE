import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/shared/hooks/auth/useAuth';

/**
 * Component that redirects users based on their role
 * - User role -> /home
 * - Label role -> /label/home
 */
const RoleBasedRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Not authenticated, redirect to login
      navigate('/login', { replace: true });
      return;
    }

    const roleName = user.role?.name;
    const currentPath = location.pathname;

    // Don't redirect if already on the correct path
    if (roleName === 'Label' && currentPath.startsWith('/label')) {
      return;
    }
    if (roleName === 'User' && !currentPath.startsWith('/label')) {
      return;
    }

    // Redirect based on role
    if (roleName === 'Label') {
      navigate('/label/home', { replace: true });
    } else if (roleName === 'User') {
      navigate('/home', { replace: true });
    } else {
      // Default to user home for unknown roles
      navigate('/home', { replace: true });
    }
  }, [user, isLoading, navigate, location.pathname]);

  return null;
};

export default RoleBasedRedirect;
