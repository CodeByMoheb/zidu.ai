import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { BackButton } from './BackButton';

interface AiArtistProps {
    onStartGenerating: (prompt: string) => void;
    isGenerating: boolean;
    onBack: () => void;
}

const AiArtist: React.FC<AiArtistProps> = ({ onStartGenerating, isGenerating, onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    setError(null);
    onStartGenerating(prompt);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col flex-1 animate-fade-in">
        <BackButton onClick={onBack} />
        <div className="flex-1 bg-gray-800/50 p-4 md:p-6 rounded-lg flex flex-col justify-between">
            <div className="space-y-4">
                <label htmlFor="artistPrompt" className="block text-sm font-medium text-gray-400 mb-2">Your Imagination</label>
                <textarea
                    id="artistPrompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                    placeholder="A realistic photo of a cat wearing a wizard hat, magical sparks flying..."
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
                 {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </div>
            <button
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="w-full mt-4 flex justify-center items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <SparklesIcon className="h-5 w-5" />
                {isGenerating ? 'Creating Magic...' : 'Generate Image'}
            </button>
        </div>
    </div>
  );
};

export default AiArtist;