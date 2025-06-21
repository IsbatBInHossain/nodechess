import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWebSocket } from '../hooks/useWebSocket'
import { type ServerMessage } from '../types/socket'

type UserState = 'idle' | 'searching'

export const LobbyPage: React.FC = () => {
  const { lastMessage, sendMessage, isAuth, isConnected } = useWebSocket()
  const [userState, setUserState] = useState<UserState>('idle')
  const navigate = useNavigate()

  const handleFindMatch = () => {
    if (isAuth) {
      sendMessage({ type: 'find_match' })
      setUserState('searching')
    }
  }

  useEffect(() => {
    const message = lastMessage as ServerMessage

    if (message?.type === 'game_start') {
      // Navigate to the game page, passing all necessary initial state
      navigate(`/game/${message.gameId}`, {
        state: {
          gameId: message.gameId,
          color: message.color,
          initialWhiteTime: message.whiteTime,
          initialBlackTime: message.blackTime,
        },
      })
    }
  }, [lastMessage, navigate])

  // A small component for the loading animation
  const SearchingIndicator = () => (
    <div className='flex flex-col items-center justify-center space-y-4 h-28'>
      <svg
        className='w-12 h-12 text-yellow-400 animate-spin'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        ></circle>
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        ></path>
      </svg>
      <p className='text-lg text-slate-300'>Searching for an opponent...</p>
    </div>
  )

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900'>
      <div className='w-full max-w-md p-8 space-y-8 text-center bg-slate-800 rounded-xl shadow-lg'>
        <div>
          <h1 className='text-4xl font-bold text-white'>Lobby</h1>
          <p className='mt-2 text-slate-400'>Ready to play?</p>
        </div>

        {/* Display connection status for user feedback and debugging */}
        <div className='flex justify-around w-full text-sm'>
          <p className='text-slate-300'>
            Server:{' '}
            <span
              className={
                isConnected
                  ? 'text-green-400 font-semibold'
                  : 'text-red-400 font-semibold'
              }
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </p>
          <p className='text-slate-300'>
            Auth:{' '}
            <span
              className={
                isAuth
                  ? 'text-green-400 font-semibold'
                  : 'text-yellow-400 font-semibold'
              }
            >
              {isAuth ? 'Authenticated' : 'Pending...'}
            </span>
          </p>
        </div>

        {/* Conditionally render the button or the searching indicator */}
        {userState === 'searching' ? (
          <SearchingIndicator />
        ) : (
          <div className='h-28 flex items-center justify-center'>
            <button
              onClick={handleFindMatch}
              // The button is disabled until the user is fully authenticated
              disabled={!isAuth || userState !== 'idle'}
              className='w-full px-8 py-4 text-xl font-bold text-gray-900 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-150 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed'
            >
              Find Match
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
