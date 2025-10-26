import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { SparklesIcon } from './icons/SparklesIcon';
import { fileToBase64 } from '../utils/fileUtils';

interface MemoryHugProps {
    onStartGenerating: (data: {
        personName: string;
        childhoodImage: { file: File; base64: string };
        currentImage: { file: File; base64: string };
        childhoodYear: string;
        currentYear: string;
    }) => void;
    isGenerating: boolean;
}

const MemoryHug: React.FC<MemoryHugProps> = ({ onStartGenerating, isGenerating }) => {
  const [personName, setPersonName] = useState('');
  const [childhoodYear, setChildhoodYear] = useState('');
  const [currentYear, setCurrentYear] = useState('');

  const [childhoodImage, setChildhoodImage] = useState<{ file: File | null; base64: string | null }>({ file: null, base64: null });
  const [currentImage, setCurrentImage] = useState<{ file: File | null; base64: string | null }>({ file: null, base64: null });
  
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File | null, type: 'childhood' | 'current') => {
    if (file) {
      const base64 = await fileToBase64(file);
      if (type === 'childhood') {
        setChildhoodImage({ file, base64 });
      } else {
        setCurrentImage({ file, base64 });
      }
    } else {
      if (type === 'childhood') {
        setChildhoodImage({ file: null, base64: null });
      } else {
        setCurrentImage({ file: null, base64: null });
      }
    }
  };

  const handleGenerate = () => {
    if (!personName || !childhoodImage.base64 || !currentImage.base64 || !childhoodImage.file || !currentImage.file || !childhoodYear || !currentYear) {
      setError('Please fill out all fields and upload both images.');
      return;
    }
    setError(null);
    onStartGenerating({
        personName,
        childhoodImage: { file: childhoodImage.file, base64: childhoodImage.base64 },
        currentImage: { file: currentImage.file, base64: currentImage.base64 },
        childhoodYear,
        currentYear
    });
  };

  const isFormComplete = personName && childhoodImage.file && currentImage.file && childhoodYear && currentYear;

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg max-w-2xl mx-auto">
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="personName" className="block text-sm font-medium text-gray-400 mb-2">Person's Name</label>
                    <input
                        type="text"
                        id="personName"
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        placeholder="e.g., Alex"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label htmlFor="childhoodYear" className="block text-sm font-medium text-gray-400 mb-2">Childhood Year</label>
                        <input
                            type="number"
                            id="childhoodYear"
                            value={childhoodYear}
                            onChange={(e) => setChildhoodYear(e.target.value)}
                            placeholder="e.g., 2003"
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="currentYear" className="block text-sm font-medium text-gray-400 mb-2">Current Year</label>
                        <input
                            type="number"
                            id="currentYear"
                            value={currentYear}
                            onChange={(e) => setCurrentYear(e.target.value)}
                            placeholder="e.g., 2025"
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploader label="Childhood Photo" onImageUpload={(file) => handleImageUpload(file, 'childhood')} previewUrl={childhoodImage.base64} />
                <ImageUploader label="Current Photo" onImageUpload={(file) => handleImageUpload(file, 'current')} previewUrl={currentImage.base64} />
            </div>
             {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
            onClick={handleGenerate}
            disabled={!isFormComplete || isGenerating}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-fuchsia-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-fuchsia-500"
            >
            <SparklesIcon className="h-5 w-5" />
            {isGenerating ? 'Generating Your Memory...' : 'Generate Memory Hug'}
            </button>
        </div>
    </div>
  );
};

export default MemoryHug;