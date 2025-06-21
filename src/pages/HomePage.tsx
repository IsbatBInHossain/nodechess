import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const HomePage: React.FC = () => {
  const { loginAsGuest } = useAuth()
  const navigate = useNavigate()

  const handleGuestLoginClick = async () => {
    try {
      await loginAsGuest()
      // On success, navigate to the lobby
      navigate('/lobby')
    } catch (error) {
      // You can add user-facing error handling here if you want
      console.error('Failed to log in as guest:', error)
      alert('Could not log in as guest. Please try again later.')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-slate-900'>
      <div className='text-center'>
        <h1 className='text-5xl font-bold text-white mb-4'>NodeChess</h1>
        <p className='text-lg text-slate-300 mb-8'>
          The ultimate real-time chess experience.
        </p>
        <div className='space-x-4'>
          <button
            onClick={handleGuestLoginClick}
            className='px-8 py-3 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 transition-colors'
          >
            Play as Guest
          </button>
          <button
            onClick={() => navigate('/login')}
            className='px-8 py-3 text-lg font-semibold text-white bg-slate-700 rounded-lg shadow-md hover:bg-slate-600 transition-colors'
          >
            Login / Register
          </button>
        </div>
      </div>
    </div>
  )
}
