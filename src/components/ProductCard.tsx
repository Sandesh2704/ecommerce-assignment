import { useState, useEffect } from 'react';

import { AddToCartButton } from './AddToCartButton';
import { Product } from '../types/types';

interface ProductCardProps {
  product: Product;
  tall?: boolean;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({
  product,
  tall = true,
  viewMode = 'grid',
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ['/assets/image.webp'];

  useEffect(() => {
    if (!isHovering || viewMode === 'list' || productImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prev) => (prev + 1) % productImages.length
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isHovering, viewMode, productImages.length]);

  useEffect(() => {
    if (!isHovering) setCurrentImageIndex(0);
  }, [isHovering]);

  const formatCurrency = (price: number) => `$${price}`;

  if (viewMode === 'list') {
    return (
      <div  data-testid="product-card" className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
        <div className="flex gap-6 p-6">
          <div className="flex gap-3">
            <div className="flex flex-col gap-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                    currentImageIndex === index
                      ? 'border-black shadow-md'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>

            <div className="relative w-80 h-96 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImages[currentImageIndex]}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {productImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                  {currentImageIndex + 1} / {productImages.length}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between py-2">
            <a href={`/product/${product.id}`} className="flex-1">
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                  {product.category?.name}
                </p>

                <h2 className="font-semibold text-xl text-black mb-3 line-clamp-2">
                  {product.title}
                </h2>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {product.description}
                </p>
              </div>
            </a>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-3xl font-bold text-black">
                {formatCurrency(product.price)}
              </span>

              <AddToCartButton product={product} quantity={1}>
                Add to cart
              </AddToCartButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div
   data-testid="product-card"
    className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
  >
    <a
      href={`/product/${product.id}`}
      className="flex flex-col h-full"
    >
      {/* Fixed Image Height */}
      <div className="relative h-[280px] bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          src={productImages[currentImageIndex]}
          alt={product.title}
          className="w-full h-full object-cover"
        />

        {productImages.length > 1 && isHovering && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded-full text-xs z-10">
            {currentImageIndex + 1} / {productImages.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 min-h-[170px]">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide line-clamp-1 h-[20px]">
          {product.category?.name}
        </p>

        <h2 className="font-semibold text-black mb-2 line-clamp-2 h-[48px] group-hover:text-gray-700">
          {product.title}
        </h2>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-[40px]">
          {product.description}
        </p>

        <div className="text-xl font-bold text-black mt-auto">
          {formatCurrency(product.price)}
        </div>
      </div>
    </a>

    {/* Button always aligned */}
    <div className="px-4 pb-4 mt-auto">
      <AddToCartButton
        className="rounded-lg px-6 w-full"
        product={product}
        quantity={1}
      >
        Add to cart
      </AddToCartButton>
    </div>
  </div>
);
}

export default ProductCard;