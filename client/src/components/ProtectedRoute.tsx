import { Navigate, Outlet } from "react-router-dom"
import { isLoggedIn } from "../pages/utils/token"
const ProtectedRoute = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" /> 
}

export default ProtectedRoute