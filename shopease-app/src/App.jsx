// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CartProvider } from './contexts/CartContext';

// Komponen Layout
import Header from './components/Header';
import Footer from './components/Footer'; // Tambahkan ini

// Halaman
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage'; // Tambahkan ini

const App = () => {
    return (
        <CartProvider>
            <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-gray-100">
                    <Header />
                    
                    <main className="flex-grow container mx-auto px-4 py-8">
                        <Routes>
                            {/* Rute untuk Halaman Daftar Produk (Beranda) */}
                            <Route path="/" element={<ProductList />} />
                            
                            {/* Rute untuk Halaman Detail Produk */}
                            <Route path="/product/:id" element={<ProductDetail />} />
                            
                            {/* Rute untuk Halaman Keranjang */}
                            <Route path="/cart" element={<CartPage />} />
                            
                            {/* Rute untuk Halaman Checkout */}
                            <Route path="/checkout" element={<CheckoutPage />} /> {/* Tambahkan ini */}
                        </Routes>
                    </main>
                    
                    <Footer />
                </div>
            </BrowserRouter>
        </CartProvider>
    );
};

export default App;