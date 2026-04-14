import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthProvider";

const { setIsAuth } = useAuth();

const handleLogout = async () => {
  await api.post("/logout");
  setIsAuth(false);
};

export default handleLogout;