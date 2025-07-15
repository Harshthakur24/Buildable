import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import SubmitProject from './pages/SubmitProject'
import Settings from './pages/Settings'
import Projects from './pages/Projects'
import Leaderboard from './pages/Leaderboard'
import Explore from './pages/Explore'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/submit-project" element={<SubmitProject />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}

export default App
