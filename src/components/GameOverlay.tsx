import type React from 'react'
import type { ServerMessage } from '../types/socket'

// An overlay to show the game over state and handle redirection
export const GameOverOverlay: React.FC<{
  result: ServerMessage | null
  onRedirect: () => void
}> = ({ result, onRedirect }) => {
  if (result?.type !== 'game_over') return null

  let message = 'Game Over'
  if (result.reason === 'checkmate') {
    message = `Checkmate! ${
      result.winner.charAt(0).toUpperCase() + result.winner.slice(1)
    } wins.`
  } else if (result.reason === 'abort') {
    message = 'Game Aborted'
  } else {
    message = `Game over by ${result.reason}.`
  }

  return (
    <div className='absolute inset-0 bg-black/75 flex flex-col items-center justify-center z-20 text-center p-4'>
      <h2 className='text-4xl font-bold text-white mb-2'>{message}</h2>
      {result.result && (
        <p className='text-2xl text-slate-300 mb-6'>Result: {result.result}</p>
      )}
      <button
        onClick={onRedirect}
        className='px-8 py-3 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 transition-colors'
      >
        Return to Lobby
      </button>
    </div>
  )
}
