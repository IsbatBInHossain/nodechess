import React from 'react'

interface CountdownOverlayProps {
  isActive: boolean
  countdown: number
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  isActive,
  countdown,
}) => {
  // If the overlay is not active, render nothing.
  if (!isActive) {
    return null
  }

  // Determine the text to display.
  const displayText = countdown > 0 ? String(countdown) : 'Go!'

  return (
    // The main container acts as the dark overlay
    <div className='absolute inset-0 bg-black/70 flex items-center justify-center z-20'>
      <div
        key={countdown}
        className='text-8xl font-bold text-white animate-zoom-fade-in'
      >
        {displayText}
      </div>
    </div>
  )
}
