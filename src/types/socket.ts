// Client to Server messages

interface AuthMessage {
  type: 'auth'
  token: string
}

interface FindMatchMessage {
  type: 'find_match'
}

interface MoveMessage {
  type: 'move'
  gameId: number
  move: {
    from: string
    to: string
  }
}

interface ResignMessage {
  type: 'resign'
  gameId: number
}

interface AbortMessage {
  type: 'abort'
  gameId: number
}

// A discriminated union of all possible messages the client can send
export type ClientMessage =
  | AuthMessage
  | FindMatchMessage
  | MoveMessage
  | ResignMessage
  | AbortMessage

// --- Server to Client ---

interface AuthSuccessMessage {
  type: 'auth_success'
}

interface GameStartMessage {
  type: 'game_start'
  gameId: number
  color: 'w' | 'b'
  whiteTime: number
  blackTime: number
}

interface MoveMadeMessage {
  type: 'move_made'
  gameId: number
  move: { from: string; to: string }
  fen: string
  turn: 'w' | 'b'
  whiteTime: number
  blackTime: number
}

interface GameOverMessage {
  type: 'game_over'
  reason: string
  winner: 'white' | 'black' | 'none'
  result: string
}

interface ErrorMessage {
  type: 'error'
  message: string
}

// A discriminated union of all possible messages the server can send
export type ServerMessage =
  | AuthSuccessMessage
  | GameStartMessage
  | MoveMadeMessage
  | GameOverMessage
  | ErrorMessage
