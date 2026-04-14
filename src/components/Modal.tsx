import { useState, useEffect,  } from 'react';
import { ChevronRight,  ChevronLeft, X, ZoomIn, ZoomOut } from 'lucide-react';
import { createPortal } from 'react-dom';


interface CustomModalProps { 
  isOpen: boolean; 
  onClose: () => void; 
  images: string[]; 
  initialIndex: number;
}

const CustomModal = ({ isOpen, onClose, images, initialIndex }: CustomModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return createPortal(
    <div 
     data-testid="image-modal"
      className=" bg-black/90 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 2147483647 }}
    >
      <div 
        className="relative w-full h-full max-w-7xl mx-auto p-4"
        onClick={(e) => e.stopPropagation()}
        
      >
        <button
        aria-label='Close'
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
           data-testid="close-modal"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
          >
            {isZoomed ? <ZoomOut className="w-6 h-6 text-white" /> : <ZoomIn className="w-6 h-6 text-white" />}
          </button>
        </div>

        <div 
          className="relative w-full h-full flex items-center justify-center"
          onMouseMove={handleMouseMove}
        >
          <div 
            className={`relative ${isZoomed ? 'cursor-crosshair' : 'cursor-default'}`}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              overflow: isZoomed ? 'hidden' : 'visible'
            }}
          >
            <img
              src={images[currentIndex]}
              alt={`Product view ${currentIndex + 1}`}
              className={`object-contain transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              }}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
               aria-label='left'
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
               aria-label='right'
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 p-4">
            {images.map((img, idx) => (
              <button
               aria-label='image'
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsZoomed(false);
                }}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === idx ? 'border-white shadow-lg scale-105' : 'border-white/30 hover:border-white/60'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
      document.body
  );
};


export default CustomModal