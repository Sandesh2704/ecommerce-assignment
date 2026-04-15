import { useState, useEffect } from 'react';

import { AddToCartButton } from './AddToCartButton';
import { Product } from '../types/types';

interface ProductCardProps {
  product: Product;
  tall?: boolean;
}

export function ProductCard({
  product,
  tall = true,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ['/assets/image.webp'];

  useEffect(() => {
    if (!isHovering  || productImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prev) => (prev + 1) % productImages.length
      );
    }, 850);

    return () => clearInterval(interval);
  }, [isHovering, productImages.length]);

  useEffect(() => {
    if (!isHovering) setCurrentImageIndex(0);
  }, [isHovering]);

  const formatCurrency = (price: number) => `$${price}`;

 

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
         {/* Skeleton */}
  {!imgLoaded && (
    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
  )}
        <img
          src={productImages[currentImageIndex]}
          alt={product.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
      imgLoaded ? "opacity-100" : "opacity-0"
    }`}
           loading="lazy"
    onLoad={() => setImgLoaded(true)}
    onError={() => setImgLoaded(true)}
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