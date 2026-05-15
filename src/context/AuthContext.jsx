import { createContext, useContext, useState, useEffect } from 'react'
import { wsService } from '../services/websocket'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Restore session on page load
    const token  = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (token && stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      wsService.connect(parsed.user_id)
    }
    setReady(true)
  }, [])

  const login = (userData) => {
    localStorage.setItem('token', userData.token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    wsService.connect(userData.user_id)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    wsService.disconnect()
    setUser(null)
  }

  if (!ready) return null   // Don't flash login screen

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)