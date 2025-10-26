import React, { useState, useEffect } from 'react';

const FALLBACK_API_KEY = 'AIzaSyDb_5meg9UL9wX3tvs7DxNnSTQAYC1lenw';
const maskApiKey = (key: string) => `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;

const ApiKeysPage: React.FC = () => {
    const [keys, setKeys] = useState<string[]>([]);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [newKeyInput, setNewKeyInput] = useState('');
    const [keyError, setKeyError] = useState('');

    useEffect(() => {
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
    }, []);

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
        if (keys.length === 0 || !activeKey) {
            handleSetActiveKey(newKeyInput.trim());
        }
        setNewKeyInput('');
    };

    const handleRemoveKey = (keyToRemove: string) => {
        setKeyError('');
        if (keys.length <= 1) {
            setKeyError("You cannot remove the last API key.");
            return;
        }
        const updatedKeys = keys.filter(k => k !== keyToRemove);
        setKeys(updatedKeys);
        localStorage.setItem('zidu_api_keys', JSON.stringify(updatedKeys));

        if (activeKey === keyToRemove) {
            const newActiveKey = updatedKeys[0];
            handleSetActiveKey(newActiveKey);
        }
    };

    const handleSetActiveKey = (keyToSet: string) => {
        setActiveKey(keyToSet);
        localStorage.setItem('zidu_active_api_key', keyToSet);
    };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white">API Key Management</h1>
        <div className="bg-gray-900 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg pb-2 mb-3">Add New Key</h3>
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  placeholder="Enter new API key"
                  className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
                <button onClick={handleAddKey} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Add</button>
            </div>
            {keyError && <p className="text-red-400 text-sm">{keyError}</p>}
        </div>

        <div className="bg-gray-900 p-6 rounded-lg space-y-3">
             <h3 className="font-semibold text-lg pb-2 mb-3">Managed Keys</h3>
            {keys.map((key) => (
                <div key={key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-700/50 p-3 rounded-lg text-sm gap-3">
                    <span className="font-mono text-gray-300 break-all">{maskApiKey(key)}</span>
                    <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center">
                        {activeKey === key ? (
                            <span className="text-xs font-bold text-green-400 bg-green-900/50 px-2 py-1 rounded-full">ACTIVE</span>
                        ) : (
                            <button onClick={() => handleSetActiveKey(key)} className="text-xs font-semibold text-cyan-400 hover:text-white">SET ACTIVE</button>
                        )}
                        <button onClick={() => handleRemoveKey(key)} className="text-red-500 hover:text-red-400 p-1" aria-label={`Remove key ${maskApiKey(key)}`}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ApiKeysPage;