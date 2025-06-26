import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'
      onClick={onClose} // Close modal on overlay click
    >
      <div
        className='bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md text-white border border-slate-700'
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{title}</h2>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-white text-2xl'
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
