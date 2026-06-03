import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/token";
const ProtectedRoute = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
