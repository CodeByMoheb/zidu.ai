import React from 'react';

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
    "Our AI is painting your masterpiece...",
    "This may take a moment...",
    "Applying a touch of digital magic...",
    "Almost there, perfecting the pixels...",
];

const ImageWithDownload: React.FC<{ url: string; index: number; featureName: string; altText: string }> = ({ url, index, featureName, altText }) => (
    <div className="space-y-2 group relative">
        <img src={url} alt={`${altText} ${index + 1}`} className="rounded-lg shadow-lg w-full object-cover aspect-square" />
        <a
            href={url}
            download={`${featureName}-result-${index + 1}-${Date.now()}.jpg`}
            className="absolute bottom-2 right-2 bg-green-600 text-white font-bold py-1.5 px-3 rounded-md hover:bg-green-700 transition-all text-sm opacity-0 group-hover:opacity-100 duration-300"
            aria-label={`Download image ${index + 1}`}
        >
           Download
        </a>
    </div>
);


const ResultsPage: React.FC<ResultsPageProps> = ({ isLoading, error, originalImageUrl, editedImageUrls, onGoBack, title, featureName }) => {
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
          <p className="mt-4 text-lg font-semibold text-gray-300">Applying Magic...</p>
          <p className="text-gray-400">{loadingMessage}</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-400 space-y-4">
          <p className="font-bold text-xl">An Error Occurred</p>
          <p>{error}</p>
           <button
            onClick={onGoBack}
            className="inline-block bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    if (editedImageUrls && editedImageUrls.length > 0) {
        // Side-by-side view for edits
        if (originalImageUrl) {
            return (
                <div className="space-y-6 w-full animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">{title}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div>
                        <h3 className="text-center font-semibold mb-2 text-gray-400">Original</h3>
                        <img src={originalImageUrl} alt="Original" className="rounded-lg shadow-lg w-full" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-center font-semibold text-gray-400">Edited Versions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {editedImageUrls.map((url, index) => (
                               <ImageWithDownload key={index} url={url} index={index} featureName={featureName} altText="Edited Artwork" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <button
                        onClick={onGoBack}
                        className="inline-block w-full sm:w-auto bg-fuchsia-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-fuchsia-700 transition-colors"
                    >
                        Create Another
                    </button>
                </div>
                </div>
            );
        }
        // Grid view for new generations
        return (
            <div className="space-y-6 w-full animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {editedImageUrls.map((url, index) => (
                        <ImageWithDownload key={index} url={url} index={index} featureName={featureName} altText="Generated Artwork" />
                     ))}
                </div>
                <div className="text-center">
                    <button
                        onClick={onGoBack}
                        className="inline-block w-full sm:w-auto bg-fuchsia-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-fuchsia-700 transition-colors"
                    >
                        Create Another
                    </button>
                </div>
            </div>
        );
    }
    
    // Fallback for unexpected errors
    return (
        <div className="text-center text-gray-500">
          <p>Something went wrong. Please go back and try again.</p>
           <button
            onClick={onGoBack}
            className="mt-4 inline-block bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
    );
  };

  return (
    <div className="w-full bg-gray-800/50 p-4 sm:p-8 rounded-lg shadow-inner flex justify-center items-center min-h-[70vh]">
      {renderContent()}
    </div>
  );
};

export default ResultsPage;