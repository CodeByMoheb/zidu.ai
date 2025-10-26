import React, { useState, useEffect, useCallback } from 'react';

interface ImageViewerModalProps {
  isOpen: boolean;
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ isOpen, images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);
  
  const handleNext = useCallback(() => {
    if (images.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image Viewer"
    >
      {/* Main content area */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the modal
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 p-2 bg-black/20 rounded-full"
          aria-label="Close viewer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button 
            onClick={handlePrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white/80 hover:text-white hover:bg-black/50 p-3 rounded-full transition-all"
            aria-label="Previous image"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
             </svg>
          </button>
        )}
        
        {/* Image Display */}
        <div className="relative flex flex-col items-center justify-center gap-4">
            <img 
              src={images[currentIndex]} 
              alt={`Fullscreen view ${currentIndex + 1} of ${images.length}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
             {images.length > 1 && (
                <div className="bg-black/50 text-white text-sm rounded-full px-3 py-1">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
        
        {/* Next Button */}
        {images.length > 1 && (
            <button 
                onClick={handleNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white/80 hover:text-white hover:bg-black/50 p-3 rounded-full transition-all"
                aria-label="Next image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        )}
      </div>
    </div>
  );
};

export default ImageViewerModal;
