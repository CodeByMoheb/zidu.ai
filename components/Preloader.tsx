import React from 'react';
import { Logo } from './Logo';

interface PreloaderProps {
  isVisible: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ isVisible }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-center items-center bg-gray-900 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <Logo className="h-24 w-24 text-fuchsia-500 animate-pulse-slow" />
      <p className="mt-4 text-lg text-gray-400">Loading Zidu.ai...</p>
    </div>
  );
};

export default Preloader;