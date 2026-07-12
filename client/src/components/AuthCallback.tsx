import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveToken } from "../utils/token";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams,setSearchParams] = useSearchParams()
  const token = searchParams.get("token")
  const next = searchParams.get("next")??"/"
  console.log(next)
  useEffect(() => {
    
    if (token) {
      saveToken(token);
      navigate(next);
    }
  }, []);
  return <div>Redirecting...</div>;
};
export default AuthCallback;
