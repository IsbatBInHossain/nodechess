import type React from 'react'

// A display for player info and turn status
export const PlayerInfo: React.FC<{ name: string; isTurn: boolean }> = ({
  name,
  isTurn,
}) => (
  <div
    className={`p-4 rounded-lg transition-colors ${
      isTurn ? 'bg-yellow-400/20' : 'bg-slate-700'
    }`}
  >
    <p
      className={`font-bold text-lg ${
        isTurn ? 'text-yellow-300' : 'text-white'
      }`}
    >
      {name}
    </p>
    <p className='text-sm text-slate-400'>
      {isTurn ? 'Thinking...' : 'Waiting...'}
    </p>
  </div>
)
