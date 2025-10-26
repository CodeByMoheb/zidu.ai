import React, { useState } from 'react';

interface StatsProps {
  stats: {
    hug: number;
    artist: number;
    magic: number;
  };
  onClose: () => void;
}

const ADMIN_PASSWORD = 'zidu_admin_2024'; // Hardcoded password

const Stats: React.FC<StatsProps> = ({ stats, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  };

  const totalGenerations = stats.hug + stats.artist + stats.magic;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md relative text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Close statistics"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isAuthenticated ? (
          <div>
            <h2 className="text-xl font-bold text-center mb-4 text-white">Admin Access</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
              </div>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button 
                type="submit"
                className="w-full bg-fuchsia-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition-colors"
              >
                View Statistics
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">Usage Statistics</h2>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Generations:</span>
                    <span className="text-2xl font-bold text-fuchsia-400">{totalGenerations}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center">
                <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Memory Hugs</p>
                    <p className="text-xl font-semibold">{stats.hug}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">AI Artist</p>
                    <p className="text-xl font-semibold">{stats.artist}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Photo Magic</p>
                    <p className="text-xl font-semibold">{stats.magic}</p>
                </div>
            </div>

             <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="font-semibold">API Limit:</span>
                     <span className="text-sm text-gray-400">N/A (Dev Mode)</span>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;