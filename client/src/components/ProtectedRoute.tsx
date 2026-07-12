import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/token";
const ProtectedRoute = () => {
  const target = useLocation()
  return isLoggedIn() ? <Outlet /> : <Navigate to={`/login${target.pathname!="/"? `?next=${target.pathname}`:''}`} />;
};

export default ProtectedRoute;
