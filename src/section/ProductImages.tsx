import CustomModal from "../components/Modal";
import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, } from 'lucide-react';



const ProductImages = ({ images, productName }: { images: string[]; productName: string }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

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


  useEffect(() => {
    setImgLoaded(false);
  }, [selectedImage]);

  return (
    <>
      {/* Mobile Slider */}
      <div className="relative md:hidden overflow-hidden w-full pb-6">
        <div className="relative">

          <div className="relative w-full h-[400px]">
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
            )}

            <img
              data-testid="thumbnail"
              src={images[selectedImage]}
              alt={`${productName} view ${selectedImage + 1}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              onClick={handleImageClick}
              className={`object-cover w-full h-full rounded-2xl transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
          </div>

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
            className={`w-full h-full transition-transform duration-200 ${showZoom ? 'scale-150' : 'scale-100'
              }`}
            style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
          >

            <div className="relative w-full h-full">
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}

              <img
                data-testid="thumbnail"
                ref={mainImageRef}
                src={images[selectedImage]}
                alt={productName}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
                className={`w-full h-full object-contain bg-white transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
              />
            </div>
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
                className={`border-2 rounded-lg overflow-hidden ${selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
              >
                <div className="relative w-full h-24 bg-gray-100">
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    onLoad={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "1";
                    }}
                    className="w-full h-full object-cover opacity-0 transition-opacity duration-300"
                  />
                </div>
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

