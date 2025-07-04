import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { LobbyPage } from './pages/LobbyPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { GamePage } from './pages/GamePage'

const App: React.FC = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/lobby' element={<LobbyPage />} />
          <Route path='/game/:gameId' element={<GamePage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
