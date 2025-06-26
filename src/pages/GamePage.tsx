import { Chess } from 'chess.js'
import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useWebSocket } from '../hooks/useWebSocket'
import { Chessboard } from 'react-chessboard'
import { type ClientMessage, type ServerMessage } from '../types/socket'

export const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { lastMessage, sendMessage } = useWebSocket()

  const { color: playerColor } = state || {}

  // Create a single, stable instance of the chess game using useMemo.
  const game = useMemo(() => new Chess(), [])

  // State for the local, optimistic board position
  const [fen, setFen] = useState(game.fen())

  // State to track if the game is over.
  const [isGameOver, setIsGameOver] = useState(false)

  // Logic for handling server incoming message
  useEffect(() => {
    if (!lastMessage) return

    const message = lastMessage as ServerMessage
    switch (message.type) {
      case 'move_made':
        game.load(message.fen)
        setFen(message.fen)
        break
      case 'game_over':
        setIsGameOver(true)
        // We could also display the reason using the message payload.
        alert(`Game Over: ${message.reason}`)
        break
      case 'error':
        alert(`Error: ${message.message}`)
        // If the server rejected our move, revert the optimistic update
        setFen(game.fen())
        break
    }
  }, [lastMessage, game])

  // --- Optimistic UI Update Logic ---
  const handlePieceDrop = (
    sourceSquare: string,
    targetSquare: string
  ): boolean => {
    // Don't allow moves if it's not our turn or the game is over.
    if (isGameOver || game.turn() !== playerColor) {
      return false
    }

    // Create a new move object.
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // TODO: Handle piece promotion later
    }

    // Try to make the move locally
    const result = game.move(move)

    // If the move is illegal, `chess.js` returns null.
    if (result === null) {
      return false
    }

    // If the move is legal, update the UI optimistically
    setFen(game.fen())

    // Send the valid move to the server for final validation.
    const moveMessage: ClientMessage = {
      type: 'move',
      gameId: parseInt(gameId!),
      move: { from: sourceSquare, to: targetSquare },
    }
    sendMessage(moveMessage)

    return true // The move was successful locally.
  }

  const handleAbort = () => {
    sendMessage({
      type: 'abort',
      gameId: parseInt(gameId!),
    })
  }

  // Error boundary for direct navigation
  if (!playerColor) {
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
      <div>
        <p>You are playing as {playerColor === 'w' ? 'White' : 'Black'}</p>
        <p>Turn: {game.turn() === 'w' ? 'White' : 'Black'}</p>
      </div>
      <div>
        <Chessboard
          position={fen}
          onPieceDrop={handlePieceDrop}
          boardOrientation={playerColor === 'w' ? 'white' : 'black'}
          arePiecesDraggable={!isGameOver}
        />
      </div>
      <div>
        <button onClick={handleAbort} disabled={isGameOver}>
          Abort Game
        </button>
      </div>
    </div>
  )
}
