


import React, { ReactNode, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { Product } from "../types/types";

const variants = {
  primary:
    "w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 rounded font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform ",
  secondary:
    "bg-gray-300 text-gray-800 hover:bg-gray-400 px-5 py-2 rounded transition-all",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-800 px-5 py-2 rounded-md transition-all",
  outline:
    "border border-gray-500 text-gray-700 hover:bg-gray-100 px-5 py-2 rounded-md transition-all",
  icon:
    "bg-indigo-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-600 transition-all",
} as const;

type VariantKey = keyof typeof variants;

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: VariantKey;
  className?: string;
  children?: ReactNode;
   testId?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "primary",
  className = "",
  children,
  testId
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  const findNearestThumb = (): HTMLElement | null => {
    const productCard = document.querySelector(`[data-product-id="${product.id}"]`);
    if (productCard) {
      const thumb = productCard.querySelector('img:first-child, .product-image img, img') as HTMLElement;
      if (thumb) return thumb;
    }
    
   
    const images = Array.from(document.querySelectorAll('img'));
    const imageByAlt = images.find(img => 
      img.alt?.toLowerCase().includes(product.title.toLowerCase())
    );
    
    if (imageByAlt) return imageByAlt;
    
 
    return document.querySelector('.product-image img, [class*="product"] img') as HTMLElement;
  };

  const highlightTarget = (targetEl: HTMLElement) => {
    const originalTransition = targetEl.style.transition;
    const originalBoxShadow = targetEl.style.boxShadow;
    const originalTransform = targetEl.style.transform;

    targetEl.style.transition = 'all 0.3s ease-out';
    targetEl.style.transform = 'scale(1.1)';
    targetEl.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)';

    setTimeout(() => {
      targetEl.style.transition = originalTransition;
      targetEl.style.boxShadow = originalBoxShadow;
      targetEl.style.transform = originalTransform;
    }, 500);
  };

  const animateFlyToCart = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const cart = document.querySelector("[data-cart-target]") as HTMLElement;
    const sourceEl = findNearestThumb() || buttonRef.current;

    if (!cart || !sourceEl) return;

    if (prefersReduced) {
      highlightTarget(cart);
      return;
    }

    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = cart.getBoundingClientRect();
  
    let clone: HTMLElement;
    

    if (sourceEl.tagName === 'IMG') {
      clone = (sourceEl as HTMLImageElement).cloneNode(true) as HTMLElement;
      Object.assign(clone.style, {
        objectFit: 'cover',
        borderRadius: '8px',
      });
    } else {
      clone = document.createElement('div');
      clone.style.backgroundColor = '#6366f1';
      clone.style.borderRadius = '8px';
      
   
      if (product.images?.[0]) {
        clone.style.backgroundImage = `url(${product.images[0]})`;
        clone.style.backgroundSize = 'cover';
        clone.style.backgroundPosition = 'center';
      }
    }

   
    Object.assign(clone.style, {
      position: 'fixed',
      top: `${sourceRect.top}px`,
      left: `${sourceRect.left}px`,
      width: `${sourceRect.width}px`,
      height: `${sourceRect.height}px`,
      pointerEvents: 'none',
      zIndex: '9999',
      willChange: 'transform, opacity',
      transition: 'none',
    });

    document.body.appendChild(clone);


    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const sourceCenterX = sourceRect.left + sourceRect.width / 2;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2;

    const deltaX = targetCenterX - sourceCenterX;
    const deltaY = targetCenterY - sourceCenterY;

    const durationMs = 700;
    const scale = 0.2;
    const startTime = performance.now();

   
    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    function animateFrame(currentTime: number) {
      const elapsed = currentTime - startTime;
      let progress = Math.min(elapsed / durationMs, 1);

    
      const eased = easeInOutCubic(progress);
      
      const currentX = deltaX * eased;
      const currentY = deltaY * eased;
      const currentScale = 1 + (scale - 1) * eased;
      
   
      let currentOpacity = 0.9;
      if (progress > 0.8) {
        currentOpacity = 0.9 * (1 - (progress - 0.8) / 0.2);
      }
      
      clone.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
      clone.style.opacity = currentOpacity.toString();

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        clone.remove();
      }
    }

    requestAnimationFrame(animateFrame);
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

  
    await addToCart(product, quantity);

  
    animateFlyToCart();

    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`${variants[variant]} ${className}`}
      disabled={loading}
       data-testid={testId || "add-to-cart"}
    >
      {loading ? "Adding..." : children || "Add to Cart"}
    </button>
  );
}