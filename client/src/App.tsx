import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Immerse from "./pages/Immerse"
import Battle from "./pages/Battle"
import UserProfile from "./pages/UserProfile"
function App() {

  return (
    <Router>
      <Routes>
        <Route path = "/" element={<Homepage /> }/>
        <Route path = "/immerse/" element={<Immerse /> }/>
        <Route path = "/battle/:id" element={<Battle /> }/>
        <Route path = "/profile/:id" element={<UserProfile /> }/>
      </Routes>
    </Router>
  )
}

export default App
