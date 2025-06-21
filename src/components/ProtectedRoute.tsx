import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { WebSocketProvider } from '../providers/WebSocketProvider'

export const ProtectedRoute: React.FC = () => {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to='/login' replace />
  }

  // If authenticated, render the provider which in turn renders the actual page
  return (
    <WebSocketProvider>
      <Outlet />
    </WebSocketProvider>
  )
}
