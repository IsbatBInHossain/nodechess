// src/provider/WebSocketProvider.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { WebSocketContext } from '../context/WebSocketContext'
import { type ClientMessage, type ServerMessage } from '../types/socket'

// This is the implementation of the hook, but living inside a provider.
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth() // It needs the token to authenticate
  const socketRef = useRef<WebSocket | null>(null)

  const [lastMessage, setLastMessage] = useState<ServerMessage | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // If there's no token, close the connection if it exists
    if (!token) {
      if (socketRef.current) {
        socketRef.current.close()
      }
      return // Exit the effect early.
    }

    // Create a new WebSocket instance.
    const ws = new WebSocket(import.meta.env.VITE_SOCKET_URL)
    socketRef.current = ws

    // --- Assign Event Handlers ---

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)

      // Send auth message
      const authMessage: ClientMessage = { type: 'auth', token }
      ws.send(JSON.stringify(authMessage))
    }

    ws.onmessage = event => {
      // Parse the message
      const message: ServerMessage = JSON.parse(event.data)
      // console.log('Received message:', message)

      // Check for auth success specifically.
      if (message.type === 'auth_success') {
        setIsAuthenticated(true)
      }

      // Update the last message state for any component to use.
      setLastMessage(message)
    }

    ws.onerror = error => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      // Reset all state when the connection closes.
      socketRef.current = null
      setIsConnected(false)
      setIsAuthenticated(false)
    }

    // Cleanup function
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [token])

  // A memoized function for sending messages.
  const sendMessage = useCallback(
    (message: ClientMessage) => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN &&
        isAuthenticated
      ) {
        socketRef.current.send(JSON.stringify(message))
      } else {
        console.error(
          'Cannot send message: WebSocket is not connected or authenticated.'
        )
      }
    },
    [isAuthenticated]
  )

  const contextValue = {
    lastMessage,
    sendMessage,
    isConnected,
    isAuth: isAuthenticated,
  }

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  )
}
