

import { useState, useEffect, useCallback, } from 'react';
import { Star, Shield, Truck, RotateCcw, Check, Minus, Plus } from 'lucide-react';
import { Product } from '../types/types';
import ProductCard from '../components/ProductCard';
import { AddToCartButton } from '../components/AddToCartButton';
import api from '../api/api';
import { useParams } from 'react-router-dom';
import { Container } from '../components/Container';
import ProductDetailsSkeleton from '../section/ProductDetailsSkeleton';
import ProductImages from '../section/ProductImages';
import ProductInfo from '../section/ProductInfo';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';


const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="min-h-[700px] bg-gray-50 flex items-center justify-center">
    <div className="text-center max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="text-red-500 text-6xl mb-6">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Error Loading Product</h2>
      <p className="text-gray-700 mb-6">{message}</p>
      <Button onClick={onRetry} className="py-4">
        Try Again
      </Button>
    </div>
  </div>
);

export function ProductDetailsPage() {
  const { id } = useParams();
  const { items,  } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonKey, setButtonKey] = useState(0); // Add key for forcing re-render

const fetchProductData = useCallback(async () => {
  if (!id) return;
  setLoading(true);
  setError(null);

  try {
    const productData = await api.getProduct(Number(id));
    setProduct(productData);
    setButtonKey(prev => prev + 1);

    if (productData.category?.id) {
      const productsByCategory = await api.getProductsByCategory(
        productData.category.id
      );

      const filtered = productsByCategory
        .filter((p) => p.id !== productData.id)
        .slice(0, 4);

      setRelatedProducts(filtered);
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load product');
  } finally {
    setLoading(false);
  }
}, [id]);

useEffect(() => {
  fetchProductData();
}, [fetchProductData]);

  useEffect(() => {
    if (!product) return;
    const cartItem = items.find((item) => item.id === product.id);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [product, items]);

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  if (loading) return <ProductDetailsSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProductData} />;
  if (!product) return <ErrorMessage message="Product not found" onRetry={fetchProductData} />;

  const productImages = product.images && product.images.length > 0
    ? product.images
    : ['/assets/image.webp'];

  const formatCurrency = (price: number) => `$${price}`;

  return (
    <>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-primary to-secondary text-white py-8">
        <Container className="z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 capitalize">
                {product.category?.name || 'Category'}
              </h2>
              <p className="text-lg text-white capitalize">Collection</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-white/80">Free Shipping</p>
                  <p className="font-semibold">On Orders 50+</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Easy Returns</p>
                  <p className="font-semibold">30-Day Policy</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <Container className="px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium line-clamp-1">{product.title}</span>
          </nav>
        </Container>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 pb-4">
        <Container className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Left Column - Image Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="sticky top-32">
                <ProductImages images={productImages} productName={product.title} />
              </div>
            </div>

            {/* Middle Column - Product Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  <span className="text-green-700 font-medium">In Stock</span>
                </div>
              </div>

              <div>
                <h1 data-testid="product-title" className="text-3xl lg:text-4xl font-bold text-black mb-2 leading-tight">
                  {product.title}
                </h1>
                <p className="text-sm text-gray-700">{product.description}</p>
              </div>

              <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-300" />
                    ))}
                  </div>
                  <span className="font-semibold text-lg">6.0</span>
                </div>
                <a href="#reviews" className="text-blue-600 hover:underline text-sm">
                  7 reviews
                </a>
              </div>

              {/* Price Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-sm text-gray-700">Price:</span>
                  <span className="text-3xl font-bold text-red-600">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Inclusive of all taxes</span>
                  </div>
                  <div className="flex items-center text-green-700 font-medium">
                    <Check className="w-5 h-5 mr-2" />
                    FREE delivery on orders over $50
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h2 className="font-semibold text-lg mb-3 text-black">Key Features</h2>
                <ul className="space-y-2">
                  {[
                    'Premium quality materials',
                    'Expert craftsmanship',
                    'Comfortable all-day wear',
                    'Easy care instructions',
                    'Versatile styling options'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-green-700 mr-3 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Specifications */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4 text-black">Product Details</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-700">Category</dt>
                    <dd className="font-medium capitalize">{product.category?.name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-700">Product ID</dt>
                    <dd className="font-medium text-gray-700">#{product.id}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-700">Created</dt>
                    <dd className="font-medium text-gray-700">
                      {new Date(product.creationAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-700">Status</dt>
                    <dd className="font-medium text-green-700 capitalize">Available</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right Column - Buy Box */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 z-0 inset-0 rounded-lg p-6 shadow-lg sticky  z-0">
                <div className="mb-6">
                  <div className="flex items-center text-green-700 font-semibold mb-2">
                    <Check className="w-5 h-5 mr-2" />
                    In Stock
                  </div>
                </div>

                {/* Quantity Selector - Fixed with proper handlers */}
                <div className="flex items-center border-2 w-fit border-gray-300 rounded-lg mb-3">
                  <button
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    data-testid="decrease-qty"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span  data-testid="quantity-value" className="px-6 py-2 text-base font-semibold border-x-2 border-gray-300">
                    {quantity}
                  </span>
                  <button
                    className="p-2 hover:bg-gray-100"
                    aria-label="Increase quantity"
                    onClick={handleIncreaseQuantity}
                    data-testid="increase-qty"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Fixed AddToCartButton with key prop */}
                <AddToCartButton 
                  testId="product-add-to-cart"
                  key={`${product.id}-${buttonKey}`} // Force re-render when product changes
                  product={product} 
                  quantity={quantity}
                >
                  Add to Cart
                </AddToCartButton>

                <div className="mt-6 pt-6 border-t space-y-3 text-sm">
                  <div className="flex items-center text-gray-700">
                    <Shield className="w-5 h-5 text-gray-700 mr-3" />
                    <span>Secure transaction</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Truck className="w-5 h-5 text-gray-700 mr-3" />
                    <span>Ships from Warehouse</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <RotateCcw className="w-5 h-5 text-gray-700 mr-3" />
                    <span>30-day return policy</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className="text-sm text-gray-700">Add gift wrap ($5.00)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <ProductInfo product={product} />
        </Container>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Container className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Related Products</h2>
                <p className="text-gray-700">Discover more products you might like</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          </Container>
        )}
      </div>
    </>
  );
}

export default ProductDetailsPage;