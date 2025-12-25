import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    const handleLinkClick = () => setIsOpen(false);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                            <i className="fas fa-shopping-bag"></i>
                            ShopEase
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <Link 
                            to="/" 
                            className={`text-gray-600 hover:text-blue-600 font-medium transition ${location.pathname === '/' ? 'text-blue-600' : ''}`}
                        >
                            Products
                        </Link>
                        <Link 
                            to="/cart" 
                            className="relative text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1"
                        >
                            <i className="fas fa-shopping-cart text-lg"></i>
                            <span>Cart</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <div className="flex items-center md:hidden">
                        <Link to="/cart" className="mr-4 text-gray-600 hover:text-blue-600 relative">
                            <i className="fas fa-shopping-cart text-xl"></i>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="text-gray-600 hover:text-blue-600 focus:outline-none p-1"
                        >
                            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
                        <Link 
                            to="/" 
                            onClick={handleLinkClick}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            Products
                        </Link>
                        <Link 
                            to="/cart" 
                            onClick={handleLinkClick}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/cart' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            Shopping Cart
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;