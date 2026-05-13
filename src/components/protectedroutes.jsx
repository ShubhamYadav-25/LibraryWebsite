import { Navigate } from "react-router-dom";
import AuthLoading from "./AuthLoading";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { authLoading, isAuth } = useAuth();

  if (authLoading || isAuth === null) {
    return <AuthLoading />;
  }

  if (isAuth === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
