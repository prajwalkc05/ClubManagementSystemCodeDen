import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { hasAccess } from '../utils/roleGuard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuth = authService.isAuthenticated();
  const userRole = authService.getRole();

  if (!isAuth) return <Navigate to="/login" replace />;
  if (!hasAccess(userRole, allowedRoles)) return <Navigate to="/unauthorized" replace />;
  
  return children;
};

export default ProtectedRoute;
