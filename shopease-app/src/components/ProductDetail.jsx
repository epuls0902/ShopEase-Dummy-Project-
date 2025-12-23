// src/components/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';
import Toast from '../components/Toast';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [lastAddedTime, setLastAddedTime] = useState(0);
    const { addToCart } = useCart();
    const { id } = useParams();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await api.getProductById(id);
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            setToast({ message: 'Gagal memuat detail produk', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastAddedTime;
        
        // Jika waktu sejak penambahan terakhir kurang dari 5 detik, abaikan klik
        if (timeDiff < 5000) {
            setToast({ message: 'Mohon tunggu 5 detik sebelum menambahkan produk ini lagi', type: 'error' });
            return;
        }
        
        setIsAdding(true);
        addToCart(product);
        setToast({ message: `${product.title} ditambahkan ke keranjang`, type: 'success' });
        setLastAddedTime(currentTime);
        
        // Reset status tombol setelah 5 detik
        setTimeout(() => {
            setIsAdding(false);
        }, 5000);
    };

    // Menghitung sisa waktu cooldown
    const currentTime = Date.now();
    const timeDiff = currentTime - lastAddedTime;
    const remainingTime = Math.max(0, 5000 - timeDiff);
    const isCooldownActive = remainingTime > 0;

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <i className="fas fa-exclamation-triangle text-6xl text-gray-300 mb-4"></i>
                <p className="text-xl text-gray-500">Produk tidak ditemukan</p>
            </div>
        );
    }

    return (
        <div>
            {toast && <Toast key={toast.message} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 p-4">
                        <img src={product.thumbnail} alt={product.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="md:w-1/2 p-6">
                        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                        <p className="text-3xl font-bold text-blue-600 mb-4">${product.price}</p>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <button 
                            className={`px-6 py-3 rounded-lg w-full font-medium transition ${
                                isCooldownActive 
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            onClick={handleAddToCart}
                            disabled={isCooldownActive}
                        >
                            {isCooldownActive ? (
                                <span>Mohon tunggu sebentar</span>
                            ) : (
                                <>
                                    <i className="fas fa-cart-plus mr-2"></i>
                                    Tambah ke Keranjang
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;