import { useCallback } from "react";
import { useAuth } from "../context/AuthProvider";

const useLogout = () => {
  const { logout } = useAuth();

  return useCallback(async () => {
    await logout();
  }, [logout]);
};

export default useLogout;
