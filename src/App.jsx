import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Reservations from './pages/Reservations'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/Home" element={<Home/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App 