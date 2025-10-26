import React from 'react';
import { Logo } from './Logo';

const Header: React.FC = () => {
  return (
    <header className="py-6 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
       <div className="container mx-auto px-4">
        <div className="flex justify-start items-center gap-4">
            <Logo className="h-10 w-10 text-fuchsia-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
              Zidu.ai
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;