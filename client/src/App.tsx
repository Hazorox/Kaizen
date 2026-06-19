import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Immerse from "./pages/Immerse";
import Battle from "./pages/Battle";
import BattleMake from "./pages/BattleMake";
import UserProfile from "./pages/UserProfile";
import Recents from "./pages/Recents";
import LogReg from "./pages/LogReg";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./components/AuthCallback"
import 'react-tooltip/dist/react-tooltip.css'
import NotFound from "./pages/404";
import MobileBlock from "./pages/mobileBlock"
import { useEffect, useState } from "react";
function App() {
  const [isMobile,setIsMobile] = useState(false)
  useEffect(()=>{
    const check=()=>{
      if(window.innerWidth < 760) setIsMobile(true)
    }
  check()
  window.addEventListener("resize",check)
  return ()=> window.removeEventListener("resize",check)
  },[])
  if(isMobile) return <MobileBlock />
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LogReg />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/immerse/" element={<Immerse />} />
          <Route path="/battle/:id" element={<Battle />} />
          <Route path="/battle/" element={<BattleMake />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/profile/" element={<UserProfile />} />
          <Route path="/recents/" element={<Recents />} />
        </Route>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Router>
  );
}

export default App;
