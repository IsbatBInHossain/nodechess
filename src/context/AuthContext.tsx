import { createContext, useEffect, useState } from 'react'
import { login, loginAsGuest, register } from '../api/auth.service.ts'

interface AuthContextType {
  token: string | null
  login: (username: string, password: string) => Promise<string>
  loginAsGuest: () => Promise<string>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem('token')
  )

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token)
    } else {
      sessionStorage.removeItem('token')
    }
  }, [token])

  const handleLogin = async (
    username: string,
    password: string
  ): Promise<string> => {
    const token = await login(username, password)
    setToken(token)
    return token
  }

  const handleLoginAsGuest = async (): Promise<string> => {
    const token = await loginAsGuest()
    setToken(token)
    return token
  }

  const handleRegister = async (
    username: string,
    password: string
  ): Promise<void> => {
    await register(username, password)
  }

  const handleLogout = () => {
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login: handleLogin,
        loginAsGuest: handleLoginAsGuest,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
