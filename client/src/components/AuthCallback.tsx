import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { saveToken } from "../pages/utils/token"

const AuthCallback = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      saveToken(token)
      navigate('/')
    }
  }, [])
  return <div>Redirecting...</div>
}
export default AuthCallback