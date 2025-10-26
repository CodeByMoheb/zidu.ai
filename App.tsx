import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MemoryHug from './components/MemoryHug';
import AiArtist from './components/AiArtist';
import PhotoMagic from './components/PhotoMagic';
import ResultsPage from './components/ResultsPage';
import Preloader from './components/Preloader';
import Stats from './components/Stats';
import StatsTrigger from './components/StatsTrigger';
import { editImageWithText, generateMemoryHugImage, generateImageWithImagen } from './services/geminiService';
import { HeartIcon } from './components/icons/HeartIcon';
import { PaintBrushIcon } from './components/icons/PaintBrushIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { addWatermark } from './utils/imageUtils';

type View = 'home' | 'hug' | 'artist' | 'magic' | 'results';

type PageContext = {
  type: 'edit' | 'hug' | 'artist' | null;
  title: string;
  featureName: string;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
}> = ({ icon, title, description, onClick, gradient }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white/50 bg-gradient-to-br ${gradient} shadow-lg`}
  >
    <div className="flex items-start gap-4">
      <div className="bg-white/10 p-3 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-200 mt-1">{description}</p>
      </div>
    </div>
  </button>
);


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [originalImageForEdit, setOriginalImageForEdit] = useState<{ base64: string } | null>(null);
  const [editedImages, setEditedImages] = useState<string[] | null>(null);
  const [generatedHugImages, setGeneratedHugImages] = useState<string[] | null>(null);
  const [artistImages, setArtistImages] = useState<string[] | null>(null);

  const [pageContext, setPageContext] = useState<PageContext>({ type: null, title: '', featureName: '' });
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  const [showStats, setShowStats] = useState(false);
  const [generationStats, setGenerationStats] = useState({ hug: 0, artist: 0, magic: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleError = (e: any) => {
    setError(e.message || "An unknown error occurred.");
  };

  const handleStartEditing = async (image: { file: File, base64: string }, prompt: string) => {
    if (!image || !prompt) return;
    
    setIsLoading(true);
    setError(null);
    setOriginalImageForEdit({ base64: image.base64 });
    setEditedImages(null);
    setPageContext({ type: 'edit', title: 'Your Magic is Ready!', featureName: 'zidu-ai-edit' });
    setCurrentView('results');

    try {
        const result = await editImageWithText(image.base64, image.file.type, prompt);
        const watermarkedResult = await Promise.all(result.map(img => addWatermark(img)));
        setEditedImages(watermarkedResult);
        setGenerationStats(prev => ({ ...prev, magic: prev.magic + 1 }));
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
    setCurrentView('results');
    
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
        const watermarkedResult = await Promise.all(result.map(img => addWatermark(img)));
        setGeneratedHugImages(watermarkedResult);
        setGenerationStats(prev => ({ ...prev, hug: prev.hug + 1 }));
    } catch (e: any) {
        handleError(e);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleStartArtist = async (prompt: string) => {
      setIsLoading(true);
      setError(null);
      setArtistImages(null);
      setPageContext({ type: 'artist', title: 'Your Artwork is Ready!', featureName: 'zidu-ai-artist' });
      setCurrentView('results');

      try {
          const result = await generateImageWithImagen(prompt);
          const watermarkedResult = await Promise.all(result.map(img => addWatermark(img)));
          setArtistImages(watermarkedResult);
          setGenerationStats(prev => ({ ...prev, artist: prev.artist + 1 }));
      } catch (e: any) {
          handleError(e);
      } finally {
          setIsLoading(false);
      }
  };

  const handleGoHome = () => {
    setCurrentView('home');
    setOriginalImageForEdit(null);
    setEditedImages(null);
    setGeneratedHugImages(null);
    setArtistImages(null);
    setError(null);
    setPageContext({ type: null, title: '', featureName: '' });
  }

  const renderHomeView = () => (
    <div className="flex flex-col justify-center items-center h-full text-center animate-fade-in p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div>
           <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500">
            Unlock Your Visual Imagination
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Choose a tool to begin your creative journey.
          </p>
        </div>
        <div className="space-y-4">
            <FeatureCard
                title="Memory Hug"
                description="Merge past and present into one emotional image."
                icon={<HeartIcon className="h-8 w-8 text-rose-300"/>}
                onClick={() => setCurrentView('hug')}
                gradient="from-rose-500/80 to-pink-600/80"
            />
            <FeatureCard
                title="AI Artist"
                description="Turn your words into stunning, original artwork."
                icon={<PaintBrushIcon className="h-8 w-8 text-cyan-300"/>}
                onClick={() => setCurrentView('artist')}
                gradient="from-cyan-500/80 to-blue-600/80"
            />
            <FeatureCard
                title="Photo Magic"
                description="Edit your photos with simple text commands."
                icon={<SparklesIcon className="h-8 w-8 text-amber-300"/>}
                onClick={() => setCurrentView('magic')}
                gradient="from-amber-500/80 to-orange-600/80"
            />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(currentView) {
      case 'home':
        return renderHomeView();
      case 'hug':
        return <MemoryHug onStartGenerating={handleStartMemoryHug} isGenerating={isLoading && pageContext.type === 'hug'} onBack={handleGoHome} />;
      case 'artist':
        return <AiArtist onStartGenerating={handleStartArtist} isGenerating={isLoading && pageContext.type === 'artist'} onBack={handleGoHome} />;
      case 'magic':
        return <PhotoMagic onStartEditing={handleStartEditing} isEditing={isLoading && pageContext.type === 'edit'} onBack={handleGoHome} />;
      case 'results':
        return <ResultsPage
            isLoading={isLoading}
            error={error}
            originalImageUrl={pageContext.type === 'edit' ? originalImageForEdit?.base64 || null : null}
            editedImageUrls={
              pageContext.type === 'edit' ? editedImages :
              pageContext.type === 'hug' ? generatedHugImages :
              pageContext.type === 'artist' ? artistImages : null
            }
            onGoBack={handleGoHome}
            title={pageContext.title}
            featureName={pageContext.featureName}
          />;
      default:
        return renderHomeView();
    }
  }

  if (isAppLoading) {
    return <Preloader isVisible={true} />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8 flex flex-col">
        {renderContent()}
      </main>
      <footer className="text-center py-2">
         <StatsTrigger onClick={() => setShowStats(true)} />
      </footer>
      {showStats && <Stats stats={generationStats} onClose={() => setShowStats(false)} />}
    </div>
  );
};

export default App;