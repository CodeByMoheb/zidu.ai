import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import { SparklesIcon } from './icons/SparklesIcon';
import { fileToBase64 } from '../utils/imageUtils';
import { BackButton } from './BackButton';

interface MemoryHugProps {
    onStartGenerating: (data: {
        personName: string;
        childhoodImage: { file: File; base64: string };
        currentImage: { file: File; base64: string };
        childhoodYear: string;
        currentYear: string;
    }) => void;
    isGenerating: boolean;
    onBack: () => void;
}

const TOTAL_STEPS = 5;

const ProgressIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="flex w-full gap-2 px-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
            <div key={index} className="h-1.5 flex-1 rounded-full bg-gray-700">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 transition-all duration-500"
                    style={{ width: index < currentStep ? '100%' : '0%' }}
                />
            </div>
        ))}
    </div>
);


const MemoryHug: React.FC<MemoryHugProps> = ({ onStartGenerating, isGenerating, onBack }) => {
  const [step, setStep] = useState(1);
  const [outgoingStep, setOutgoingStep] = useState<number | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  
  const [personName, setPersonName] = useState('');
  const [childhoodYear, setChildhoodYear] = useState('');
  const [currentYear, setCurrentYear] = useState('');

  const [childhoodImage, setChildhoodImage] = useState<{ file: File | null; base64: string | null }>({ file: null, base64: null });
  const [currentImage, setCurrentImage] = useState<{ file: File | null; base64: string | null }>({ file: null, base64: null });
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (outgoingStep !== null) {
      const timer = setTimeout(() => setOutgoingStep(null), 400); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [outgoingStep]);

  const changeStep = (newStep: number, direction: 'forward' | 'backward') => {
    setAnimationDirection(direction);
    setOutgoingStep(step);
    setStep(newStep);
    setError(null);
  };

  const handleImageUpload = async (file: File | null, type: 'childhood' | 'current') => {
    if (file) {
      const base64 = await fileToBase64(file);
      if (type === 'childhood') setChildhoodImage({ file, base64 });
      else setCurrentImage({ file, base64 });
    } else {
      if (type === 'childhood') setChildhoodImage({ file: null, base64: null });
      else setCurrentImage({ file: null, base64: null });
    }
  };

  const handleGenerate = () => {
    if (!personName || !childhoodImage.base64 || !currentImage.base64 || !childhoodImage.file || !currentImage.file || !childhoodYear || !currentYear) {
      setError('Please ensure all information is provided.');
      return;
    }
    onStartGenerating({
        personName,
        childhoodImage: { file: childhoodImage.file, base64: childhoodImage.base64 },
        currentImage: { file: currentImage.file, base64: currentImage.base64 },
        childhoodYear,
        currentYear
    });
  };

  const renderStepContent = (stepToRender: number, isOutgoing: boolean) => {
    let animationClass = '';
    if (isOutgoing) {
        animationClass = animationDirection === 'forward' ? 'animate-slide-out-to-left' : 'animate-slide-out-to-right';
    } else if (outgoingStep !== null) {
        animationClass = animationDirection === 'forward' ? 'animate-slide-in-from-right' : 'animate-slide-in-from-left';
    }

    const commonWrapperClass = `absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center p-4 ${animationClass}`;
    
    switch (stepToRender) {
      case 1:
        return (
          <div className={commonWrapperClass}>
            <h2 className="text-2xl font-bold mb-4">Upload a Childhood Photo</h2>
            <div className="w-full max-w-xs">
                <ImageUploader label="" onImageUpload={(file) => handleImageUpload(file, 'childhood')} previewUrl={childhoodImage.base64} />
            </div>
            <button onClick={() => changeStep(2, 'forward')} disabled={!childhoodImage.file} className="mt-6 w-full max-w-xs bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50">Next</button>
          </div>
        );
      case 2:
        return (
          <div className={commonWrapperClass}>
            <h2 className="text-2xl font-bold mb-4">What year was it?</h2>
            <input type="number" value={childhoodYear} onChange={(e) => setChildhoodYear(e.target.value)} placeholder="e.g., 2003" className="w-full max-w-xs text-center text-2xl bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"/>
            <button onClick={() => changeStep(3, 'forward')} disabled={!childhoodYear} className="mt-6 w-full max-w-xs bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50">Next</button>
          </div>
        );
      case 3:
        return (
          <div className={commonWrapperClass}>
            <h2 className="text-2xl font-bold mb-4">Upload a Current Photo</h2>
             <div className="w-full max-w-xs">
                <ImageUploader label="" onImageUpload={(file) => handleImageUpload(file, 'current')} previewUrl={currentImage.base64} />
             </div>
            <button onClick={() => changeStep(4, 'forward')} disabled={!currentImage.file} className="mt-6 w-full max-w-xs bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50">Next</button>
          </div>
        );
       case 4:
        return (
          <div className={commonWrapperClass}>
            <h2 className="text-2xl font-bold mb-4">And the current year?</h2>
            <input type="number" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} placeholder="e.g., 2025" className="w-full max-w-xs text-center text-2xl bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"/>
            <button onClick={() => changeStep(5, 'forward')} disabled={!currentYear} className="mt-6 w-full max-w-xs bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50">Next</button>
          </div>
        );
       case 5:
        return (
          <div className={commonWrapperClass}>
            <h2 className="text-2xl font-bold mb-4">Finally, what's the name?</h2>
            <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="e.g., Alex" className="w-full max-w-xs text-center text-2xl bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"/>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button onClick={handleGenerate} disabled={isGenerating || !personName} className="mt-6 w-full max-w-xs flex justify-center items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-fuchsia-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                 <SparklesIcon className="h-5 w-5" />
                 {isGenerating ? 'Generating...' : 'Generate Memory Hug'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 animate-fade-in">
        <BackButton onClick={onBack} />
        <div className="bg-gray-800/50 p-4 md:p-6 rounded-lg flex-1 flex flex-col justify-between">
            <ProgressIndicator currentStep={step} />
            <div className="flex-1 relative overflow-hidden mt-4">
               {renderStepContent(step, false)}
               {outgoingStep && renderStepContent(outgoingStep, true)}
            </div>
            {step > 1 && (
                <button onClick={() => changeStep(step - 1, 'backward')} className="text-gray-400 hover:text-white text-sm mt-4">
                    Back
                </button>
            )}
        </div>
    </div>
  );
};

export default MemoryHug;