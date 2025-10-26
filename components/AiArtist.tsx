import React, { useState } from 'react';
import GeneratedImageViewer from './GeneratedImageViewer';
import { SparklesIcon } from './icons/SparklesIcon';
import { generateImageWithImagen } from '../services/geminiService';

const AiArtist: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedImages(null);

    try {
      const result = await generateImageWithImagen(prompt);
      setGeneratedImages(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6 bg-gray-800/50 p-6 rounded-lg">
        <div>
          <label htmlFor="artistPrompt" className="block text-sm font-medium text-gray-400 mb-2">Your Imagination</label>
          <textarea
            id="artistPrompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="A realistic photo of a cat wearing a wizard hat, magical sparks flying..."
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={!prompt || isLoading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SparklesIcon className="h-5 w-5" />
          {isLoading ? 'Creating Magic...' : 'Generate Image'}
        </button>
      </div>
      <div>
        <GeneratedImageViewer isLoading={isLoading} error={error} imageUrls={generatedImages} featureName="ai-artist" />
      </div>
    </div>
  );
};

export default AiArtist;