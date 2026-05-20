import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Immerse from "./pages/Immerse"
import Battle from "./pages/Battle"
function App() {

  return (
    <Router>
      <Routes>
        <Route path = "/" element={<Homepage /> }/>
        <Route path = "/immerse/" element={<Immerse /> }/>
        <Route path = "/battle/:id" element={<Battle /> }/>
      </Routes>
    </Router>
  )
}

export default App
