import React, { useState, useEffect } from 'react';

interface StatsProps {
  stats: {
    hug: number;
    artist: number;
    magic: number;
  };
  onClose: () => void;
}

const ADMIN_PASSWORD = 'zidu_admin_2024';
const FALLBACK_API_KEY = 'AIzaSyDb_5meg9UL9wX3tvs7DxNnSTQAYC1lenw';

const maskApiKey = (key: string) => `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;

const Stats: React.FC<StatsProps> = ({ stats, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [keys, setKeys] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [newKeyInput, setNewKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
        let storedKeys: string[] = JSON.parse(localStorage.getItem('zidu_api_keys') || 'null');
        let currentActiveKey = localStorage.getItem('zidu_active_api_key');

        if (!storedKeys || storedKeys.length === 0) {
            storedKeys = [FALLBACK_API_KEY];
            localStorage.setItem('zidu_api_keys', JSON.stringify(storedKeys));
        }

        if (!currentActiveKey || !storedKeys.includes(currentActiveKey)) {
            currentActiveKey = storedKeys[0];
            localStorage.setItem('zidu_active_api_key', currentActiveKey);
        }

        setKeys(storedKeys);
        setActiveKey(currentActiveKey);
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password.');
    }
  };

  const handleAddKey = () => {
    setKeyError('');
    if (!newKeyInput.trim()) {
        setKeyError('API key cannot be empty.');
        return;
    }
    if (keys.includes(newKeyInput.trim())) {
        setKeyError('This API key already exists.');
        return;
    }
    const updatedKeys = [...keys, newKeyInput.trim()];
    setKeys(updatedKeys);
    localStorage.setItem('zidu_api_keys', JSON.stringify(updatedKeys));
    // If it's the first key being added manually, make it active
    if (keys.length === 0) {
        handleSetActiveKey(newKeyInput.trim());
    }
    setNewKeyInput('');
  };

  const handleRemoveKey = (keyToRemove: string) => {
    if (keys.length <= 1) {
        setKeyError("You cannot remove the last API key.");
        return;
    }
    const updatedKeys = keys.filter(k => k !== keyToRemove);
    setKeys(updatedKeys);
    localStorage.setItem('zidu_api_keys', JSON.stringify(updatedKeys));

    if (activeKey === keyToRemove) {
        const newActiveKey = updatedKeys[0];
        setActiveKey(newActiveKey);
        localStorage.setItem('zidu_active_api_key', newActiveKey);
    }
  };

  const handleSetActiveKey = (keyToSet: string) => {
    setActiveKey(keyToSet);
    localStorage.setItem('zidu_active_api_key', keyToSet);
  };

  const totalGenerations = stats.hug + stats.artist + stats.magic;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-lg relative text-gray-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Close statistics"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
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
              {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
              <button 
                type="submit"
                className="w-full bg-fuchsia-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition-colors"
              >
                View Admin Panel
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">Admin Panel</h2>
            
            {/* Usage Stats Section */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b border-gray-700 pb-1">Usage Statistics</h3>
                <div className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center">
                    <span className="font-semibold">Total Generations:</span>
                    <span className="text-2xl font-bold text-fuchsia-400">{totalGenerations}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-700 p-3 rounded-lg"><p className="text-sm text-gray-400">Memory Hugs</p><p className="text-xl font-semibold">{stats.hug}</p></div>
                    <div className="bg-gray-700 p-3 rounded-lg"><p className="text-sm text-gray-400">AI Artist</p><p className="text-xl font-semibold">{stats.artist}</p></div>
                    <div className="bg-gray-700 p-3 rounded-lg"><p className="text-sm text-gray-400">Photo Magic</p><p className="text-xl font-semibold">{stats.magic}</p></div>
                </div>
            </div>

            {/* API Key Management Section */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b border-gray-700 pb-1">API Key Management</h3>
                 <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeyInput}
                      onChange={(e) => setNewKeyInput(e.target.value)}
                      placeholder="Enter new API key"
                      className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    />
                    <button onClick={handleAddKey} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Add</button>
                </div>
                {keyError && <p className="text-red-400 text-sm">{keyError}</p>}
                
                <div className="space-y-2">
                    {keys.map((key) => (
                        <div key={key} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-lg text-sm">
                            <span className="font-mono text-gray-300">{maskApiKey(key)}</span>
                            <div className="flex items-center gap-2">
                                {activeKey === key ? (
                                    <span className="text-xs font-bold text-green-400 bg-green-900/50 px-2 py-1 rounded-full">ACTIVE</span>
                                ) : (
                                    <button onClick={() => handleSetActiveKey(key)} className="text-xs text-cyan-400 hover:text-white">Set Active</button>
                                )}
                                <button onClick={() => handleRemoveKey(key)} className="text-red-500 hover:text-red-400 p-1" aria-label={`Remove key ${maskApiKey(key)}`}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;