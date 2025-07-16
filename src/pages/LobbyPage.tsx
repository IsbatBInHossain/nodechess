import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../hooks/useWebSocket';
import { type ServerMessage } from '../types/socket';
import { ThemedLayout } from '../components/ThemedLayout'; // Import our new layout

type UserState = 'idle' | 'searching';

export const LobbyPage: React.FC = () => {
  const { logout } = useAuth();
  const { lastMessage,  isAuth } = useWebSocket();
  
  const [userState, setUserState] = useState<UserState>('idle');
  // We'll use a placeholder for now, or you can set it to 0.
  const [waitingPlayers, _setWaitingPlayers] = useState(0); 
  const navigate = useNavigate();

  // New handler for leaving the lobby
  const handleGoHome = () => {
    logout(); // This will disconnect the WebSocket and clear the auth token
    navigate('/');
  };

  const handleFindMatch = () => {
    if (isAuth) {
      // sendMessage({ type: 'find_match' }); //! Commented out for now
      setUserState('searching');
    }
  };

  useEffect(() => {
    const message = lastMessage as ServerMessage;

    if (message?.type === 'game_start') {
      navigate(`/game/${message.gameId}`, { state: { ...message } });
    }

    // TODO: Add logic for handling waiting player updates
    // if (message?.type === 'matchmaking_update') {
    //   setWaitingPlayers(message.waitingPlayers);
    // }
  }, [lastMessage, navigate]);

  const SearchingIndicator = () => (
    <div className="flex flex-col items-center justify-center space-y-4 h-28">
      <svg
        className="w-12 h-12 text-accent-secondary animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-lg text-text-secondary font-serif">Searching for an opponent...</p>
    </div>
  );

  return (
     <ThemedLayout>
      <div className="w-full max-w-md p-8 text-center bg-surface bg-washi rounded-xl shadow-2xl border border-white/10">
        
        <h1 className="font-serif text-5xl font-bold text-text-primary">Lobby</h1>
        <p className="mt-2 text-text-secondary">The quiet before the storm.</p>
        
        <div className="my-8">
            <p className="text-text-secondary">
                Players currently waiting: 
                <span className="font-bold text-accent-secondary text-lg ml-2">{waitingPlayers}</span>
            </p>
        </div>

        {userState === 'searching' ? (
          <SearchingIndicator />
        ) : (
          <div className="h-28 flex flex-col items-center justify-center gap-4">
            <button
              onClick={handleFindMatch}
              disabled={!isAuth}
              className="w-full px-8 py-4 text-xl font-bold font-serif text-text-primary bg-accent-primary rounded-lg shadow-lg hover:brightness-110 transition-all duration-150 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              Find Match
            </button>
            <button
              onClick={handleGoHome}
              className="w-full py-2 font-serif text-text-secondary border border-text-secondary/50 rounded-lg hover:bg-white/5 transition-colors"
            >
              Leave
            </button>
          </div>
        )}
      </div>
    </ThemedLayout>
  );
};