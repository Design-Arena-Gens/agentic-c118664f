import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from './auth/AuthProvider'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OwnerDashboard from './pages/OwnerDashboard'
import RenterDashboard from './pages/RenterDashboard'
import ProtectedRoute from './pages/ProtectedRoute'

function App() {
  const { user, role, logout } = useAuth()
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 bg-beige dark:bg-charcoal border-b border-black/10 dark:border-white/10">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="font-semibold text-lg">Rent Ease</Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm opacity-80">{role ?? 'no-role'}</span>
                <button className="px-3 py-1 rounded bg-navy text-beige" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1 rounded bg-navy text-beige">Login</Link>
                <Link to="/signup" className="px-3 py-1 rounded border border-navy text-navy">Sign Up</Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <motion.main className="container py-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/owner" element={<ProtectedRoute allowRole="owner"><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/renter" element={<ProtectedRoute allowRole="renter"><RenterDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </div>
  )
}

function ThemeToggle() {
  return (
    <button
      className="px-3 py-1 rounded border"
      onClick={() => {
        const root = document.documentElement
        root.classList.toggle('dark')
        localStorage.theme = root.classList.contains('dark') ? 'dark' : 'light'
      }}
    >
      Theme
    </button>
  )
}

function Home() {
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">Welcome to Rent Ease</h1>
      <p className="max-w-prose">Manage properties, rooms, bills, and notes with a clean, responsive interface.</p>
    </section>
  )
}

export default App
