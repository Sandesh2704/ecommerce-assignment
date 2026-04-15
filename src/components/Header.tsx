import { Link } from "react-router-dom";
import { Container } from "./Container";
import { useCart } from "../context/CartContext";



export default function Header() {
  const { cartCount } = useCart();




 





  return (
    <>
      <header className={`sticky top-0 z-40 w-full bg-white  border-b border-gray-200 transition-all duration-300`}>





        <Container  className="">
         
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link       title={`Home`} to={`/`} className="flex items-center space-x-2">
             Assignment Store
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              
              <Link       title={`Home `} to={`/`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Home
              </Link>

        
              <Link        title={`About`} to={`/about`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                About
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">


              {/* Cart */}
              <Link
              to="/cart"
                aria-label="Cart"
data-testid="cart-icon" 
                className="p-2 text-gray-700 hover:text-black transition-colors relative"
                data-cart-target
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>

             
            </div>
          </div>

        </Container>
      </header>

   
    </>
  );
}