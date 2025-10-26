import React from 'react';

interface HeaderProps {
  onClose: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClose }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm p-4 flex justify-end items-center sticky top-0 z-10">
      <button
        onClick={onClose}
        className="bg-fuchsia-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition-colors"
      >
        Back to App
      </button>
    </header>
  );
};
