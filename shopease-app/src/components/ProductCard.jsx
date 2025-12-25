import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product, showToast }) => {
    const { addToCart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [lastAddedTime, setLastAddedTime] = useState({});

    const handleAddToCart = (e) => {
        if (e) e.stopPropagation();
        
        const currentTime = Date.now();
        const lastTime = lastAddedTime[product.id] || 0;
        const timeDiff = currentTime - lastTime;
        
        if (timeDiff < 2000) {
            showToast('Please wait 2 seconds before adding again', 'error');
            return;
        }
        
        setIsAdding(true);
        addToCart(product);
        showToast('Item added to cart successfully', 'success');
        setLastAddedTime({ ...lastAddedTime, [product.id]: currentTime });
        
        setTimeout(() => setIsAdding(false), 2000); 
    };

    const handleCardClick = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const currentTime = Date.now();
    const timeDiff = currentTime - (lastAddedTime[product.id] || 0);
    const isCooldownActive = (2000 - timeDiff) > 0;

    return (
        <>
            {/* CARD UI */}
            <div 
                // HAPUS 'bg-white' DI SINI, agar background halaman dasar terlihat
                className="rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col h-full group"
                onClick={handleCardClick}
            >
                <div className="h-48 overflow-hidden relative bg-white/50">
                    <img 
                        src={product.thumbnail} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                
                {/* Menambahkan background semi-transparan (glassmorphism) pada area teks agar tetap terbaca di atas background halaman */}
                <div className="p-4 flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 leading-tight line-clamp-1">{product.title}</h3>
                    <p className="text-gray-500 mb-3 text-sm line-clamp-2 flex-1">{product.description}</p>
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                        <span className="text-xl font-bold text-blue-600">${product.price}</span>
                        
                        {/* TOMBOL ADD DI CARD */}
                        <button 
                            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 transform active:scale-95 select-none
                                ${isCooldownActive 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 shadow-md cursor-pointer'
                                }`}
                            onClick={handleAddToCart}
                            disabled={isCooldownActive}
                        >
                            {isCooldownActive ? (
                                <span className="flex items-center gap-1"><i className="fas fa-clock"></i> Wait...</span> 
                            ) : (
                                <><i className="fas fa-cart-plus"></i> Add</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL POP-UP */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={closeModal} 
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative animate-slide-up"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white hover:text-red-500 rounded-full p-2 text-gray-500 transition-all shadow-sm border border-gray-100"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
                            <img 
                                src={product.thumbnail} 
                                alt={product.title} 
                                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm mix-blend-multiply"
                            />
                        </div>

                        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                            <div className="mb-4">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                                    {product.category}
                                </span>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2 leading-tight">{product.title}</h2>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                                    <i className="fas fa-star text-sm"></i> 
                                    <span className="font-bold text-sm">{product.rating}</span>
                                </div>
                                <span className="text-gray-400">|</span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <i className="fas fa-box text-xs"></i> {product.stock} Stock
                                </span>
                            </div>
                            
                            <p className="text-gray-600 mb-8 leading-relaxed text-justify">
                                {product.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 mb-1">Price</span>
                                    <span className="text-3xl font-extrabold text-blue-600">${product.price}</span>
                                </div>

                                {/* TOMBOL ADD DI MODAL */}
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={isCooldownActive}
                                    className={`px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 shadow-lg transition-all duration-300 select-none transform active:scale-95
                                        ${isCooldownActive 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 cursor-pointer'
                                        }`}
                                >
                                    {isCooldownActive ? (
                                        <span className="flex items-center gap-2"><i className="fas fa-hourglass-half"></i> Wait...</span>
                                    ) : (
                                        <><i className="fas fa-shopping-bag"></i> Add to Cart</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;