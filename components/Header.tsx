import React from 'react';
import { Logo } from './Logo';

const Header: React.FC = () => {
  return (
    <header className="py-6 text-center bg-gray-900/50 backdrop-blur-sm">
      <div className="flex justify-center items-center gap-4">
        <Logo className="h-12 w-12 text-fuchsia-500" />
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
          Zidu.ai
        </h1>
      </div>
      <p className="mt-2 text-lg text-gray-400">
        AI-Powered Image Magic.
      </p>
    </header>
  );
};

export default Header;