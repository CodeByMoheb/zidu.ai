import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  text?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, text = 'Back to Tools' }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-md p-1 self-start"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    <span className="text-sm font-medium">{text}</span>
  </button>
);