import React from 'react'
import { useNavigate } from 'react-router-dom'

export const GameNotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900 text-center'>
      <div className='w-full max-w-md p-8 bg-slate-800 rounded-xl shadow-lg'>
        {/* A simple icon for visual feedback */}
        <div className='mx-auto mb-4 text-red-400 w-16 h-16'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
            />
          </svg>
        </div>

        <h1 className='text-3xl font-bold text-white mb-2'>Game Not Found</h1>
        <p className='text-slate-300 mb-6'>
          This game may have already ended, or you might not have permission to
          view it. Please return to the lobby to find a new match.
        </p>
        <button
          onClick={() => navigate('/lobby')}
          className='w-full px-8 py-3 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 transition-colors'
        >
          Return to Lobby
        </button>
      </div>
    </div>
  )
}
