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
    const roleId = user.roleId;
    const currentPath = location.pathname;

    // Check if user is Label (either by roleId === 3 or role.name === 'Label')
    const isLabel = roleId === 2 || roleName === 'Label';

    const isAdmin = roleId === 3 || roleName === 'Admin';
    
    // Redirect based on role
    if (isLabel) {
      // Label users should be redirected to /label/home if not already on /label path
      if (!currentPath.startsWith('/label')) {
        navigate('/label/home', { replace: true });
      }
    }
    else if (isAdmin) {
      // Admin users should be redirected to /admin/home if not already on /admin path
      if (!currentPath.startsWith('/admin')) {
        navigate('/admin/home', { replace: true });
      }
    }
     else {
      // Non-label users should NOT access /label paths
      if (currentPath.startsWith('/label')) {
        navigate('/home', { replace: true });
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  return null;
};

export default RoleBasedRedirect;
