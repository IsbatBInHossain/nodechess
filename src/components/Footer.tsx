import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="absolute bottom-2 left-0 right-0 text-center">
      <p className="text-xs text-text-secondary/50">
        <a href="https://www.vecteezy.com/free-vector/sakura" className="underline hover:text-text-primary">Sakura Vectors by Vecteezy</a>
        {' | '}
        Texture by <a href="https://www.transparenttextures.com/" className="underline hover:text-text-primary">Transparent Textures</a>
      </p>
    </footer>
  );
};