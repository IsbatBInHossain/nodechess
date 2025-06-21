import { createContext } from 'react'
import { type ServerMessage, type ClientMessage } from '../types/socket'

interface WebSocketContextType {
  lastMessage: ServerMessage | null
  sendMessage: (message: ClientMessage) => void
  isConnected: boolean
  isAuth: boolean
}

export const WebSocketContext = createContext<WebSocketContextType | null>(null)
