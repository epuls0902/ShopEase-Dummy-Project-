import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Header = () => {
    const { getTotalItems } = useCart();

    return (
        <header className="bg-blue-600 text-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">
                    <i className="fas fa-shopping-bag mr-2"></i>
                    ShopEase
                </Link>
                <nav>
                    <Link to="/" className="mr-4 hover:text-blue-200 transition">
                        Produk
                    </Link>
                    <Link to="/cart" className="hover:text-blue-200 transition">
                        <i className="fas fa-shopping-cart mr-1"></i>
                        Keranjang ({getTotalItems()})
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;