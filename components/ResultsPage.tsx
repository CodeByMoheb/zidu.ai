import React, { useState, useEffect } from 'react';
import { BackButton } from './BackButton';
import ImageViewerModal from './ImageViewerModal';

interface ResultsPageProps {
  isLoading: boolean;
  error: string | null;
  originalImageUrl: string | null;
  editedImageUrls: string[] | null;
  onGoBack: () => void;
  title: string;
  featureName: string;
}

const loadingMessages = [
    "Warming up the AI's imagination...",
    "Blending pixels and emotions...",
    "Searching for nostalgic light...",
    "This takes a bit of time, the AI is a true artist!",
    "Crafting your unique memory...",
];

const ResultsPage: React.FC<ResultsPageProps> = ({
  isLoading,
  error,
  originalImageUrl,
  editedImageUrls,
  onGoBack,
  title,
  featureName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);
  
  const openModal = (index: number) => {
    setModalStartIndex(index);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const imagesToShow = editedImageUrls || [];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 animate-fade-in">
      <BackButton onClick={onGoBack} />
      <div className="bg-gray-800/50 p-4 md:p-6 rounded-lg flex-1 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 mb-6">
          {title}
        </h2>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Column for Original Image */}
          {originalImageUrl && (
            <div className="flex flex-col items-center animate-fade-in">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Original</h3>
              <div className="w-full max-w-sm aspect-square relative group">
                <img
                  src={originalImageUrl}
                  alt="Original"
                  className="rounded-lg shadow-lg w-full h-full object-cover"
                />
                 <button
                    onClick={() => openModal(0)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="View original image larger"
                 >
                    View
                 </button>
              </div>
            </div>
          )}

          {/* Column for Generated Images */}
          <div className={`flex flex-col items-center w-full ${!originalImageUrl ? 'md:col-span-2' : ''}`}>
             <h3 className="text-xl font-semibold text-gray-300 mb-4">Your Creations</h3>
              {isLoading && (
                  <div className="text-center p-8 w-full flex flex-col justify-center items-center aspect-square">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-500 mx-auto"></div>
                      <p className="mt-4 text-lg font-semibold text-gray-300">Generating...</p>
                      <p className="text-gray-400">{loadingMessage}</p>
                  </div>
              )}
              {error && (
                  <div className="text-center text-red-400 p-8 w-full flex flex-col justify-center items-center aspect-square">
                      <p className="font-bold">An error occurred</p>
                      <p>{error}</p>
                  </div>
              )}
              { !isLoading && !error && imagesToShow.length > 0 && (
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {imagesToShow.map((url, index) => (
                          <div key={index} className="space-y-2 group relative aspect-square">
                              <img src={url} alt={`Generated Artwork ${index + 1}`} className="rounded-lg shadow-lg w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                                  <button
                                      onClick={() => openModal(originalImageUrl ? index + 1 : index)}
                                      className="bg-white/20 text-white font-bold py-2 px-4 rounded-md hover:bg-white/30 transition-all text-sm"
                                      aria-label={`View generated image ${index + 1} larger`}
                                  >
                                    View
                                  </button>
                                  <a
                                      href={url}
                                      download={`${featureName}-result-${index + 1}-${Date.now()}.jpg`}
                                      className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-all text-sm"
                                      aria-label={`Download image ${index + 1}`}
                                  >
                                    Download
                                  </a>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
              { !isLoading && !error && imagesToShow.length === 0 && (
                 <div className="text-center text-gray-500 p-8 w-full flex flex-col justify-center items-center aspect-square">
                    <p>Your generated masterpieces will appear here.</p>
                </div>
              )}
          </div>
        </div>
      </div>
      
      <ImageViewerModal
        isOpen={isModalOpen}
        images={originalImageUrl ? [originalImageUrl, ...imagesToShow] : imagesToShow}
        startIndex={modalStartIndex}
        onClose={closeModal}
      />
    </div>
  );
};

export default ResultsPage;
