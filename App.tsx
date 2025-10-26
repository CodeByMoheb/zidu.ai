import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MemoryHug from './components/MemoryHug';
import AiArtist from './components/AiArtist';
import PhotoMagic from './components/PhotoMagic';
import ResultsPage from './components/ResultsPage';
import Preloader from './components/Preloader';
import { editImageWithText, generateMemoryHugImage } from './services/geminiService';

type Tab = 'hug' | 'artist' | 'magic';
type Page = 'home' | 'results';
type PageContext = {
  type: 'edit' | 'hug' | null;
  title: string;
  featureName: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('hug');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for Photo Magic
  const [originalImageForEdit, setOriginalImageForEdit] = useState<{ base64: string } | null>(null);
  const [editedImages, setEditedImages] = useState<string[] | null>(null);

  // State for Memory Hug
  const [generatedHugImages, setGeneratedHugImages] = useState<string[] | null>(null);

  const [pageContext, setPageContext] = useState<PageContext>({ type: null, title: '', featureName: '' });
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Simulate initial asset loading
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleError = (e: any) => {
    let errorMessage = e.message || "An unknown error occurred.";
    // Provide a more specific, helpful error for the most common configuration issue.
    if (errorMessage.includes("API Key has not been configured")) {
        errorMessage = "DEVELOPER: Your API Key is not configured. Please add your Google AI API key to this project's secrets to enable the application.";
    }
    setError(errorMessage);
  };

  const handleStartEditing = async (image: { file: File, base64: string }, prompt: string) => {
    if (!image || !prompt) return;
    
    setIsLoading(true);
    setError(null);
    setOriginalImageForEdit({ base64: image.base64 });
    setEditedImages(null);
    setPageContext({ type: 'edit', title: 'Your Magic is Ready!', featureName: 'zidu-ai-edit' });
    setCurrentPage('results');

    try {
        const result = await editImageWithText(image.base64, image.file.type, prompt);
        setEditedImages(result);
    } catch (e: any) {
        handleError(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleStartMemoryHug = async (data: {
    personName: string;
    childhoodImage: { file: File; base64: string };
    currentImage: { file: File; base64: string };
    childhoodYear: string;
    currentYear: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setGeneratedHugImages(null);
    setPageContext({ type: 'hug', title: 'Your Memory Hug is Ready!', featureName: 'zidu-ai-hug' });
    setCurrentPage('results');
    
    try {
        const result = await generateMemoryHugImage(
            data.personName,
            data.childhoodImage.base64,
            data.childhoodImage.file.type,
            data.currentImage.base64,
            data.currentImage.file.type,
            data.childhoodYear,
            data.currentYear
        );
        setGeneratedHugImages(result);
    } catch (e: any) {
        handleError(e);
    } finally {
        setIsLoading(false);
    }
  };


  const handleGoHome = () => {
    setCurrentPage('home');
    setOriginalImageForEdit(null);
    setEditedImages(null);
    setGeneratedHugImages(null);
    setError(null);
    setPageContext({ type: null, title: '', featureName: '' });
  }

  const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm md:text-base font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-fuchsia-500 ${
        activeTab === tab
          ? 'bg-fuchsia-600 text-white shadow-lg'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hug':
        return <MemoryHug onStartGenerating={handleStartMemoryHug} isGenerating={isLoading && pageContext.type === 'hug'} />;
      case 'artist':
        return <AiArtist />;
      case 'magic':
        return <PhotoMagic onStartEditing={handleStartEditing} isEditing={isLoading && pageContext.type === 'edit'} />;
      default:
        return <MemoryHug onStartGenerating={handleStartMemoryHug} isGenerating={isLoading && pageContext.type === 'hug'} />;
    }
  };

  if (isAppLoading) {
    return <Preloader isVisible={true} />;
  }
  
  // Centralized error display for the entire app if a critical error occurs (like API key)
  // This prevents showing a broken UI to end-users.
  if (error && currentPage === 'home' && error.startsWith('DEVELOPER:')) {
    return (
       <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-4">
          <Header />
          <main className="container mx-auto px-4 py-8 text-center">
             <div className="bg-red-900/50 border border-red-700 p-8 rounded-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-red-300 mb-4">Application Configuration Error</h2>
                <p className="text-red-200">{error}</p>
             </div>
          </main>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans animate-fade-in">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' ? (
          <>
            <div className="flex justify-center space-x-2 md:space-x-4 mb-8 bg-gray-800 p-2 rounded-lg shadow-md max-w-lg mx-auto">
              <TabButton tab="hug" label="Memory Hug" />
              <TabButton tab="artist" label="AI Artist" />
              <TabButton tab="magic" label="Photo Magic" />
            </div>
            <div className="w-full max-w-5xl mx-auto">
              {renderTabContent()}
            </div>
          </>
        ) : (
          <ResultsPage
            isLoading={isLoading}
            error={error}
            originalImageUrl={pageContext.type === 'edit' ? originalImageForEdit?.base64 || null : null}
            editedImageUrls={pageContext.type === 'edit' ? editedImages : generatedHugImages}
            onGoBack={handleGoHome}
            title={pageContext.title}
            featureName={pageContext.featureName}
          />
        )}
      </main>
    </div>
  );
};

export default App;