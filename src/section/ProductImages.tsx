import CustomModal from "../components/Modal";
import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft,} from 'lucide-react';



const ProductImages = ({ images, productName }: { images: string[]; productName: string }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const mainImageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleImageClick = () => {
    setModalIndex(selectedImage);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Mobile Slider */}
      <div className="relative md:hidden overflow-hidden w-full pb-6">
        <div className="relative">
          <img
          data-testid="thumbnail" 
            src={images[selectedImage]}
            alt={`${productName} view ${selectedImage + 1}`}
            className="object-cover w-full h-[400px] rounded-2xl"
            onClick={handleImageClick}
          />
          {images.length > 1 && (
            <>
              <button
             data-testid="image-left" 
              aria-label="left"
                onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
              aria-label="right"
              data-testid="image-right"
                onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop Gallery */}
      <div className="hidden md:block">
        <div
          className="relative bg-white rounded-lg overflow-hidden aspect-square border border-gray-200 shadow-lg group cursor-crosshair mb-4"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onClick={handleImageClick}
        >
          <div
            className={`w-full h-full transition-transform duration-200 ${
              showZoom ? 'scale-150' : 'scale-100'
            }`}
            style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
          >
            <img
             data-testid="thumbnail" 
              ref={mainImageRef}
              src={images[selectedImage]}
              alt={productName}
              className="w-full h-full object-contain bg-white"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                data-testid="image-left" 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1);
                }}
                aria-label="left"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                data-testid="image-right" 
              aria-label="right"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, index) => (
              <button
              data-testid="thumbnail" 
               aria-label='image'
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border-2 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'border-black' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-24 object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        initialIndex={modalIndex}
      />
    </>
  );
};

export default ProductImages

