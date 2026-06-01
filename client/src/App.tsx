import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Immerse from "./pages/Immerse";
import Battle from "./pages/Battle";
import UserProfile from "./pages/UserProfile";
import Recents from "./pages/Recents";
import LogReg from "./pages/LogReg";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./components/AuthCallback"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LogReg />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/immerse/" element={<Immerse />} />
          <Route path="/battle/:id" element={<Battle />} />
          <Route path="/battle/" element={<Battle />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/profile/" element={<UserProfile />} />
          <Route path="/recents/" element={<Recents />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
