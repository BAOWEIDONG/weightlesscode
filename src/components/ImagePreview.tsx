import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../AppContext';

export const ImagePreview = () => {
  const { imagePreview, openImagePreview, closeImagePreview } = useApp();

  useEffect(() => {
    if (imagePreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [imagePreview]);

  if (!imagePreview) return null;

  const { urls, index } = imagePreview;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      openImagePreview(urls, index - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index < urls.length - 1) {
      openImagePreview(urls, index + 1);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center backdrop-blur-sm"
      onClick={closeImagePreview}
    >
      <button 
        onClick={closeImagePreview}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/20 rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4">
        {urls.length > 1 && index > 0 && (
          <button 
            onClick={handlePrev}
            className="absolute left-4 p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all z-10 backdrop-blur-md"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        <img 
          src={urls[index]} 
          alt={`Preview ${index + 1}`}
          className="max-w-[90vw] max-h-[90vh] object-contain select-none"
          onClick={(e) => e.stopPropagation()}
        />

        {urls.length > 1 && index < urls.length - 1 && (
          <button 
            onClick={handleNext}
            className="absolute right-4 p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all z-10 backdrop-blur-md"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>

      {urls.length > 1 && (
        <div className="absolute bottom-8 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-medium tracking-wide">
          {index + 1} / {urls.length}
        </div>
      )}
    </div>
  );
};
