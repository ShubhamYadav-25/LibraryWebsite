import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useAuth();
  const [loading, setLoading] = useState(isAuth === null);

  useEffect(() => {
    if (isAuth !== null) {
      setLoading(false);
    }
  }, [isAuth]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
