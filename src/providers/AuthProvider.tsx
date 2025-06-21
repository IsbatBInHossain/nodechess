import { useCallback, useEffect, useState } from 'react'
import { login, loginAsGuest, register } from '../api/auth.service.ts'
import { AuthContext } from '../context/AuthContext.tsx'

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

  const handleLogin = useCallback(
    async (username: string, password: string): Promise<string> => {
      const receivedToken = await login(username, password)
      setToken(receivedToken)
      return receivedToken
    },
    []
  ) // Empty dependency array means this function is created only once.

  const handleLoginAsGuest = useCallback(async (): Promise<string> => {
    const receivedToken = await loginAsGuest()
    setToken(receivedToken)
    return receivedToken
  }, [])

  const handleRegisterAndLogin = useCallback(
    async (username: string, password: string): Promise<void> => {
      await register(username, password)
      const receivedToken = await login(username, password)
      setToken(receivedToken)
    },
    []
  )

  const handleLogout = useCallback(() => {
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        token,
        login: handleLogin,
        loginAsGuest: handleLoginAsGuest,
        registerAndLogin: handleRegisterAndLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
