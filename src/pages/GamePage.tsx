import { Chess } from 'chess.js'
import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useWebSocket } from '../hooks/useWebSocket'
import { Chessboard } from 'react-chessboard'
import { type ServerMessage } from '../types/socket'
import { PlayerInfo } from '../components/PlayerInfo'
import { GameOverOverlay } from '../components/GameOverlay'

export const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { lastMessage, sendMessage } = useWebSocket()

  const { color: playerColor } = state || {}

  const game = useMemo(() => new Chess(), [])
  const [fen, setFen] = useState(game.fen())
  const [gameOverData, setGameOverData] = useState<ServerMessage | null>(null)

  // Logic for handling server incoming message
  useEffect(() => {
    if (!lastMessage) return

    const message = lastMessage as ServerMessage
    let redirectTimer: NodeJS.Timeout

    switch (message.type) {
      case 'move_made':
        game.load(message.fen)
        setFen(message.fen)
        break
      case 'game_over':
        setGameOverData(message)
        alert(`Game Over: ${message.reason}`) // Show alert as requested
        // Set a timer to redirect after 3 seconds
        redirectTimer = setTimeout(() => {
          navigate('/lobby')
        }, 3000)
        break
      case 'error':
        alert(`Error: ${message.message}`)
        // If the server rejected our move, revert the optimistic update
        setFen(game.fen())
        break
    }
    // Cleanup the timer if the component unmounts before it fires
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer)
    }
  }, [lastMessage, game, navigate])

  const handlePieceDrop = (
    sourceSquare: string,
    targetSquare: string
  ): boolean => {
    if (gameOverData || game.turn() !== playerColor) return false

    const move = { from: sourceSquare, to: targetSquare, promotion: 'q' }
    const result = game.move(move)

    if (result === null) return false

    // Optimistic UI Update
    setFen(game.fen())

    // Send move to server
    sendMessage({ type: 'move', gameId: parseInt(gameId!), move })
    return true
  }

  const handleAbort = () => {
    sendMessage({ type: 'abort', gameId: parseInt(gameId!) })
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

  const whoseTurn = game.turn() === 'w' ? 'White' : 'Black'
  const opponentColorName = playerColor === 'w' ? 'Black' : 'White'
  const playerColorName = playerColor === 'w' ? 'White' : 'Black'

  return (
    <div className='flex items-center justify-center min-h-screen p-4 bg-slate-900'>
      <div className='flex flex-col lg:flex-row items-center gap-6'>
        {/* The Board */}
        <div className='relative w-[40vw] max-w-[600px] min-w-[300px]'>
          <Chessboard
            position={fen}
            onPieceDrop={handlePieceDrop}
            boardOrientation={playerColor === 'w' ? 'white' : 'black'}
            arePiecesDraggable={!gameOverData}
          />
          <GameOverOverlay
            result={gameOverData}
            onRedirect={() => navigate('/lobby')}
          />
        </div>

        {/* Player Info and Controls */}
        <div className='w-full lg:w-72 flex flex-col gap-4'>
          <PlayerInfo
            name={`Opponent (${opponentColorName})`}
            isTurn={game.turn() !== playerColor}
          />

          <div className='p-4 bg-slate-800 rounded-lg text-center'>
            <h2 className='text-xl font-bold text-white'>Turn</h2>
            <p className='text-lg text-slate-300'>{whoseTurn}</p>
          </div>

          <PlayerInfo
            name={`You (${playerColorName})`}
            isTurn={game.turn() === playerColor}
          />

          <button
            onClick={handleAbort}
            disabled={!!gameOverData}
            className='w-full py-3 mt-4 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors'
          >
            Abort Game
          </button>
        </div>
      </div>
    </div>
  )
}
