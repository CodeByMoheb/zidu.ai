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
      <div className="relative flex flex-col items-center">
        <Logo className="h-24 w-24 text-fuchsia-500 animate-scale-in-pop" />
        <h1 className="mt-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 animate-gradient-pan animate-text-focus-in opacity-0">
          Zidu.ai
        </h1>
      </div>
    </div>
  );
};

export default Preloader;