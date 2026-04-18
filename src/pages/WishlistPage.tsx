import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft,  } from 'lucide-react';

import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { getWishlist, removeWishlistItem } from '../customhook/useWishlist';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

 const WishListPage: React.FC = () => {
  const  wishListitems = getWishlist()



 

  if ( wishListitems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <Container>
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Shopping WishList</h1>
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
            {wishListitems.length} {wishListitems.length === 1 ? 'item' : 'items'} • Free shipping on orders over $50
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-6">
                {wishListitems.map((item:any) => (
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
                          onClick={() => removeWishlistItem(item.id)}
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
          
            </div>
          </div>

       
        </div>
      </Container>
    </div>
  );
};

export default WishListPage

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