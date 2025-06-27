import { Chess } from 'chess.js'
import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useWebSocket } from '../hooks/useWebSocket'
import { Chessboard } from 'react-chessboard'
import { type ServerMessage } from '../types/socket'
import { PlayerInfo } from '../components/PlayerInfo'
import { GameOverOverlay } from '../components/GameOverlay'
import { Modal } from '../components/Modal'

type GamePhase = 'pregame' | 'playing' | 'over'

export const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { lastMessage, sendMessage } = useWebSocket()

  const { color: playerColor, initialWhiteTime, initialBlackTime } = state || {}

  const game = useMemo(() => new Chess(), [])
  const [gamePhase, setGamePhase] = useState<GamePhase>('pregame')
  const [countdown, setCountDown] = useState(3)
  const [fen, setFen] = useState(game.fen())
  const [gameOverData, setGameOverData] = useState<ServerMessage | null>(null)
  const [whiteTime, setWhiteTime] = useState(initialWhiteTime || 0)
  const [blackTime, setBlackTime] = useState(initialBlackTime || 0)
  const [turn, setTurn] = useState('w')
  const [plyCount, setPlyCount] = useState(0)

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', body: '' })

  const showAlert = (title: string, body: string) => {
    setModalContent({ title, body })
    setIsModalOpen(true)
  }

  // Handle countdown logic
  useEffect(() => {
    // Only run during the 'pregame' phase.
    if (gamePhase === 'pregame') {
      const timer = setInterval(() => {
        setCountDown(prev => {
          if (prev === 1) {
            clearInterval(timer)
            setGamePhase('playing')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // return cleanup function
      return () => clearInterval(timer)
    }
  }, [gamePhase])

  // Handle clock update logic
  useEffect(() => {
    if (gamePhase !== 'playing') return

    const timer = setInterval(() => {
      if (turn === 'w') {
        setWhiteTime((t: number) => Math.max(0, t - 1000))
      } else {
        setBlackTime((t: number) => Math.max(0, t - 1000))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [turn, gamePhase])

  // Logic for handling server incoming message
  useEffect(() => {
    if (!lastMessage) return

    const message = lastMessage as ServerMessage
    let redirectTimer: NodeJS.Timeout

    switch (message.type) {
      case 'move_made':
        game.load(message.fen)
        // Sync all states with server
        setFen(message.fen)
        setWhiteTime(message.whiteTime)
        setBlackTime(message.blackTime)
        setTurn(message.turn)
        setPlyCount(prevCount => prevCount + 1)
        break

      case 'game_over':
        setGameOverData(message)
        setGamePhase('over')
        showAlert('Game Over', `The game has ended: ${message.reason}.`)
        // Set a timer to redirect after 3 seconds
        redirectTimer = setTimeout(() => {
          navigate('/lobby')
        }, 3000)
        break

      case 'error':
        showAlert('Error', message.message)
        // If the server rejected the move, revert the optimistic update
        setFen(game.fen())
        break
    }
    // Cleanup the timer if the component unmounts before it fires
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer)
    }
  }, [lastMessage, game, navigate])

  // Handle piece move
  const handlePieceDrop = (
    sourceSquare: string,
    targetSquare: string
  ): boolean => {
    if (gamePhase !== 'playing' || gameOverData || game.turn() !== playerColor)
      return false

    const move = { from: sourceSquare, to: targetSquare, promotion: 'q' }
    const result = game.move(move)

    if (result === null) return false

    // Optimistic UI Update
    setFen(game.fen())
    setTurn(game.turn())

    // Send move to server
    sendMessage({ type: 'move', gameId: parseInt(gameId!), move })
    return true
  }

  // Handles manual game ending logic
  const handleGameEndAction = () => {
    const isAbort = plyCount < 2 // Abort if less than one full move has been made
    // console.log(`history length: ${plyCount}`)
    sendMessage({
      type: isAbort ? 'abort' : 'resign',
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

  const opponentColorName = playerColor === 'w' ? 'Black' : 'White'
  const playerColorName = playerColor === 'w' ? 'White' : 'Black'
  const opponentTime = playerColor === 'w' ? blackTime : whiteTime
  const myTime = playerColor === 'w' ? whiteTime : blackTime

  return (
    <div className='flex items-center justify-center min-h-screen p-4 bg-slate-900'>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        <p className='text-slate-300'>{modalContent.body}</p>
      </Modal>
      <div className='flex flex-col lg:flex-row items-center gap-6'>
        {/* The Board */}
        <div className='relative w-[40vw] max-w-[600px] min-w-[300px]'>
          <Chessboard
            position={fen}
            onPieceDrop={handlePieceDrop}
            boardOrientation={playerColor === 'w' ? 'white' : 'black'}
            arePiecesDraggable={gamePhase === 'playing' && !gameOverData}
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
            isTurn={turn !== playerColor}
            time={opponentTime}
          />

          <div className='p-4 bg-slate-800 rounded-lg text-center'>
            <h2 className='text-xl font-bold text-white'>Turn</h2>
            <p className='text-lg text-slate-300'>
              {turn === 'w' ? 'White' : 'Black'}
            </p>
          </div>

          <PlayerInfo
            name={`You (${playerColorName})`}
            isTurn={turn === playerColor}
            time={myTime}
          />

          <button
            onClick={handleGameEndAction}
            disabled={gamePhase !== 'playing' || !!gameOverData}
            className='w-full py-3 mt-4 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors'
          >
            {plyCount < 2 ? 'Abort' : 'Resign'}
          </button>
        </div>
      </div>
    </div>
  )
}
