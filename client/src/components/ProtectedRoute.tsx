import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is not authenticated
    if (!token || !user) {
      // Save the attempted route for redirection after login
      navigate("/signin", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    // Check for role-based access if roles are specified
    if (
      allowedRoles.length > 0 &&
      user.role &&
      !allowedRoles.includes(user.role)
    ) {
      navigate("/unauthorized", { replace: true });
      return;
    }
  }, [token, user, navigate, location, allowedRoles]);

  // Show loading state while checking authentication
  if (!token || !user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
