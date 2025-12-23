// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product, showToast }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [lastAddedTime, setLastAddedTime] = useState({});

    const handleAddToCart = (e) => {
        e.stopPropagation();
        
        const currentTime = Date.now();
        const lastTime = lastAddedTime[product.id] || 0;
        const timeDiff = currentTime - lastTime;
        
        // Jika waktu sejak penambahan terakhir kurang dari 5 detik, abaikan klik
        if (timeDiff < 5000) {
            showToast('Mohon tunggu 5 detik sebelum menambahkan produk yang sama lagi', 'error');
            return;
        }
        
        setIsAdding(true);
        addToCart(product);
        showToast(`${product.title} ditambahkan ke keranjang`, 'success');
        setLastAddedTime({ ...lastAddedTime, [product.id]: currentTime });
        
        // Reset status tombol setelah 5 detik
        setTimeout(() => {
            setIsAdding(false);
        }, 5000);
    };

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    // Menghitung sisa waktu cooldown
    const currentTime = Date.now();
    const lastTime = lastAddedTime[product.id] || 0;
    const timeDiff = currentTime - lastTime;
    const remainingTime = Math.max(0, 5000 - timeDiff);
    const isCooldownActive = remainingTime > 0;

    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="h-48 overflow-hidden">
                <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 truncate">{product.title}</h3>
                <p className="text-gray-600 mb-3 text-sm truncate">{product.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">${product.price}</span>
                    <button 
                        className={`px-3 py-1 rounded-lg transition ${
                            isCooldownActive 
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        onClick={handleAddToCart}
                        disabled={isCooldownActive}
                    >
                        {isCooldownActive ? (
                            <span>tunggu sebentar</span> 
                        ) : (
                            <>
                                <i className="fas fa-cart-plus mr-1"></i>
                                Tambah
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;