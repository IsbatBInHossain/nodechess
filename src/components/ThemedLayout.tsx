import React from 'react';
import { Footer } from './Footer';
import sakuraCanopy from '/assets/sakura-canopy.svg'; 

export const ThemedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="relative min-h-screen w-full bg-primary-bg overflow-hidden">
      {/* The Moon */}
      <div className="absolute top-[10%] left-[10%] w-24 h-24 bg-moon rounded-full shadow-moon-glow z-0"></div>

      {/* The Sakura Canopy */}
      <img
        src={sakuraCanopy}
        alt="Sakura branches"
        className="absolute -top-10 -right-20 w-[600px] h-auto opacity-80 z-10 pointer-events-none"
      />
      
      {/* The Page Content - positioned above the background elements */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4">
        {children}
      </div>

      {/* The Footer */}
      <Footer />
    </main>
  );
};