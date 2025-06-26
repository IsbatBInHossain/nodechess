import React from 'react'

// Helper to format time from milliseconds to MM:SS
const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`
}

interface PlayerInfoProps {
  name: string
  isTurn: boolean
  time: number
}

// A display for player info and turn status
export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  name,
  isTurn,
  time,
}) => (
  <div
    className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
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
    {/* Display the formatted time */}
    <p
      className={`text-2xl font-mono px-4 py-1 rounded ${
        isTurn ? 'bg-yellow-400 text-slate-900' : 'bg-slate-800 text-white'
      }`}
    >
      {formatTime(time)}
    </p>
  </div>
)
