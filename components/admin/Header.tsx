import React from 'react';
import { MenuIcon } from './icons/MenuIcon';

interface HeaderProps {
  onClose: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClose, onToggleSidebar }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <button onClick={onToggleSidebar} className="text-gray-300 hover:text-white md:hidden" aria-label="Open sidebar">
        <MenuIcon className="h-6 w-6" />
      </button>
      {/* This empty div helps to center the "Back to App" button on mobile when the menu is present */}
      <div className="md:hidden"></div> 
      <button
        onClick={onClose}
        className="bg-fuchsia-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition-colors"
      >
        Back to App
      </button>
    </header>
  );
};