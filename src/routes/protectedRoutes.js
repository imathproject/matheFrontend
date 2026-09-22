import { Navigate, useLocation} from 'react-router-dom';
import { useAuth } from "authContext";
import PropTypes from "prop-types";

  export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, role, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) {
      return null;
    }

    if (!token) {
      return <Navigate to="/" replace state={{ from: location }}/>;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/welcome" replace />;
    }

    return children;
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
  };