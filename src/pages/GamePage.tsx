// src/pages/GamePage.tsx

import React from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

export const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>()

  // Get the state passed from the navigate() call in LobbyPage
  const { state } = useLocation()
  const navigate = useNavigate()

  // Safely destructure the state with fallback values.
  const { color, initialWhiteTime, initialBlackTime } = state || {
    color: null,
    initialWhiteTime: 0,
    initialBlackTime: 0,
  }

  // Handle the case where a user lands on this page without the necessary state
  if (!color) {
    return (
      <div>
        <h1>Error</h1>
        <p>No game data found. You cannot join a game directly.</p>
        <button onClick={() => navigate('/lobby')}>Return to Lobby</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Welcome to Game Page</h1>
      <p>Game ID: {gameId}</p>
      <p>Your Assigned Color: {color}</p>
      <p>Initial Time - White: {initialWhiteTime}ms</p>
      <p>Initial Time - Black: {initialBlackTime}ms</p>
    </div>
  )
}
