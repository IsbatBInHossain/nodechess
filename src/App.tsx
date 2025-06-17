import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { LobbyPage } from './pages/LobbyPage'

const App: React.FC = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/lobby' element={<LobbyPage />} />
      </Routes>
    </div>
  )
}

export default App
