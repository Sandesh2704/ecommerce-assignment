import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { Container } from '../components/Container';
import { Button } from '../components/Button';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

 const CartPage: React.FC = () => {
  const { items: cartItems, updateQuantity, remove: removeItem, getTotalPrice, getShipping } = useCart();

  console.log("Cart", cartItems)

  const subtotal = getTotalPrice();
  const shipping = getShipping();
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <Container>
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Shopping Cart</h1>
            <p className="text-lg text-white/90">Free shipping on orders over $50</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCartIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h2 data-testid="empty-cart" className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
              <p className="text-gray-600 max-w-md">
                Looks like you haven't added anything to your cart yet. Start shopping now!
              </p>
              <Link to="/">
                <Button variant="primary" size="lg" className="mt-4 ">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <Container className="px-4">
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-lg text-white/90">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} • Free shipping on orders over $50
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div  data-testid="cart-item" key={item.id} className="flex gap-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                    <Link to={`/product/${item.slug}`} className="relative w-32 h-32 flex-shrink-0">
                      <img
                        src={item.images?.[0] || '/assets/image.webp'}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4 mb-3">
                        <div>
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-semibold text-lg text-gray-900 hover:text-indigo-600 transition-colors">
                              {item.title}
                            </h3>
                          </Link>
                        </div>
                        <Button
                          variant="ghost"
                          data-testid="remove-item"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xl font-bold text-indigo-600">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                        <div className="flex items-center border-2 w-fit border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                             data-testid="decrease-cart-qty"
                          >
                            <Minus  className="w-4 h-4" />
                          </button>
                          <span data-testid="cart-qty" className="px-6 py-2 text-base font-semibold border-x-2 border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                            aria-label="Increase quantity"
                              data-testid="increase-cart-qty"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="md:text-right">
                          <p className="text-sm text-gray-600 mb-1">Total</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}


              </div>
            </div>

            <div className="flex items-center justify-between bg-white rounded-lg shadow-lg p-6">
              <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-700 font-semibold">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
              <div className="text-sm text-gray-600">
                Subtotal: <span className="font-bold ml-2">{formatCurrency(subtotal)}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(total)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Including all taxes and shipping</p>
              </div>

              <Link to="/checkout" className='w-full'>
                <Button
                  variant="primary"
                  disabled
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-gray-500 mr-3" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Truck className="w-5 h-5 text-gray-500 mr-3" />
                  <span>Free shipping over $50</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <RotateCcw className="w-5 h-5 text-gray-500 mr-3" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage

const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
};