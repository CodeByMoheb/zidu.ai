import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { SparklesIcon } from './icons/SparklesIcon';
import { fileToBase64 } from '../utils/fileUtils';

const suggestionPrompts = [
    "Add a retro filter",
    "Make it black and white",
    "Enhance the colors",
    "Remove the background",
    "Add a dreamy glow",
];

interface PhotoMagicProps {
    onStartEditing: (image: { file: File, base64: string }, prompt: string) => void;
    isEditing: boolean;
}

const PhotoMagic: React.FC<PhotoMagicProps> = ({ onStartEditing, isEditing }) => {
  const [originalImage, setOriginalImage] = useState<{ file: File | null; base64: string | null }>({ file: null, base64: null });
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File | null) => {
    if (file) {
      const base64 = await fileToBase64(file);
      setOriginalImage({ file, base64 });
    } else {
      setOriginalImage({ file: null, base64: null });
    }
  };

  const handleGenerate = () => {
    if (!prompt || !originalImage.base64 || !originalImage.file) {
      setError('Please provide an image and an editing instruction.');
      return;
    }
    setError(null);
    onStartEditing({ file: originalImage.file, base64: originalImage.base64 }, prompt);
  };

  const isFormComplete = prompt && originalImage.file;

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg max-w-xl mx-auto">
      <div className="space-y-6">
        <ImageUploader label="Upload Your Photo" onImageUpload={handleImageUpload} previewUrl={originalImage.base64} />
        <div>
          <label htmlFor="magicPrompt" className="block text-sm font-medium text-gray-400 mb-2">How should I change it?</label>
          <textarea
            id="magicPrompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="e.g., Add a retro filter, make it black and white..."
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          />
        </div>
         <div className="flex flex-wrap gap-2">
            {suggestionPrompts.map(p => (
                <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full hover:bg-fuchsia-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                    {p}
                </button>
            ))}
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={!isFormComplete || isEditing}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-rose-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-rose-500"
        >
          <SparklesIcon className="h-5 w-5" />
          {isEditing ? 'Applying Magic...' : 'Edit Image'}
        </button>
      </div>
    </div>
  );
};

export default PhotoMagic;