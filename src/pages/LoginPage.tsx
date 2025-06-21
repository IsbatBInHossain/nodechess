import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const LoginPage: React.FC = () => {
  // State for the form inputs
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // State to manage the form mode (Login vs. Register)
  const [isRegistering, setIsRegistering] = useState(false)

  // State for handling loading and error feedback
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get auth functions from our custom hook
  const { login, registerAndLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isRegistering) {
        await registerAndLogin(username, password)
      } else {
        await login(username, password)
      }
      // If successful, navigate to the lobby
      navigate('/lobby')
    } catch (err) {
      setError(
        'Login failed. Please check your credentials or try registering.'
      )
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900'>
      <div className='w-full max-w-sm p-8 space-y-6 bg-slate-800 rounded-xl shadow-lg'>
        <h1 className='text-3xl font-bold text-center text-white'>
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='username'
              className='block mb-2 text-sm font-medium text-slate-300'
            >
              Username
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className='w-full px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block mb-2 text-sm font-medium text-slate-300'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='w-full px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            type='submit'
            disabled={isLoading}
            className='w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed'
          >
            {isLoading
              ? 'Loading...'
              : isRegistering
              ? 'Register & Login'
              : 'Log In'}
          </button>
        </form>

        {error && <p className='text-sm text-center text-red-400'>{error}</p>}

        <p className='text-sm text-center text-slate-400'>
          {isRegistering
            ? 'Already have an account?'
            : "Don't have an account?"}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering)
              setError(null) // Clear errors when switching modes
            }}
            className='ml-1 font-semibold text-blue-400 hover:underline focus:outline-none'
          >
            {isRegistering ? 'Log In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  )
}
