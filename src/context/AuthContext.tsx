import { createContext } from 'react'

interface AuthContextType {
  token: string | null
  login: (username: string, password: string) => Promise<string>
  loginAsGuest: () => Promise<string>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
