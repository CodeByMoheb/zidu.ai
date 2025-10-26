import React from 'react';

interface GeneratedImageViewerProps {
  isLoading: boolean;
  error: string | null;
  imageUrls: string[] | null;
  featureName: string;
}

const loadingMessages = [
    "Warming up the AI's imagination...",
    "Blending pixels and emotions...",
    "Searching for nostalgic light...",
    "This takes a bit of time, the AI is a true artist!",
    "Crafting your unique memory...",
];


const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ isLoading, error, imageUrls, featureName }) => {
  const [loadingMessage, setLoadingMessage] = React.useState(loadingMessages[0]);
    
  React.useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-500 mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-gray-300">Generating...</p>
          <p className="text-gray-400">{loadingMessage}</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-400">
          <p className="font-bold">An error occurred</p>
          <p>{error}</p>
        </div>
      );
    }
    if (imageUrls && imageUrls.length > 0) {
      return (
        <div className="space-y-4 h-full">
            <h3 className="text-center text-xl font-semibold text-gray-300">Your AI Creations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {imageUrls.slice(0, 2).map((url, index) => (
                    <div key={index} className="space-y-2 group relative">
                        <img src={url} alt={`Generated Artwork ${index + 1}`} className="rounded-lg shadow-lg w-full object-cover aspect-square" />
                        <a
                            href={url}
                            download={`${featureName}-result-${index + 1}-${Date.now()}.jpg`}
                            className="absolute bottom-2 right-2 bg-green-600 text-white font-bold py-1.5 px-3 rounded-md hover:bg-green-700 transition-all text-sm opacity-0 group-hover:opacity-100 duration-300"
                            aria-label={`Download image ${index + 1}`}
                        >
                           Download
                        </a>
                    </div>
                ))}
            </div>
        </div>
      );
    }
    return (
        <div className="text-center text-gray-500">
          <p>Your generated masterpieces will appear here.</p>
        </div>
    );
  };

  return (
    <div className="w-full h-full bg-gray-800 p-4 rounded-lg shadow-inner flex justify-center items-center min-h-[10rem]">
      {renderContent()}
    </div>
  );
};

export default GeneratedImageViewer;