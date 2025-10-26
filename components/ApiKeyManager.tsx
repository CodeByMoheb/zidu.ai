import React, { useState } from 'react';
import { Logo } from './Logo';

interface ApiKeyManagerProps {
  onKeySubmit: (key: string) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API Key cannot be empty.');
      return;
    }
    setError('');
    onKeySubmit(apiKey.trim());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-4 animate-fade-in">
      <div className="w-full max-w-md mx-auto bg-gray-800/50 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center">
            <Logo className="h-16 w-16 text-fuchsia-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Welcome to Zidu.ai</h1>
            <p className="text-gray-400 mt-2">Please enter your Google Gemini API Key to begin.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400 mb-2">Your API Key</label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API Key here"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            />
             {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-fuchsia-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
          >
            Save & Start Creating
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
            <p>
                You can get your free API key from Google AI Studio.
            </p>
            <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-fuchsia-400 hover:text-fuchsia-300 underline"
            >
                Get your Google AI API Key
            </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;
