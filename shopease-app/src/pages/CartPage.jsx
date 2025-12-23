// src/components/CartPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Toast from '../components/Toast';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>
            
            {cartItems.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <p className="text-xl text-gray-500 mb-4">Keranjang belanja Anda kosong</p>
                    <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-block hover:bg-blue-700 transition">
                        Lanjut Belanja
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center border-b pb-4 mb-4">
                                    <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover rounded mr-4" />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-gray-600">${item.price}</p>
                                        <div className="flex items-center mt-2">
                                            <button 
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <i className="fas fa-minus text-xs"></i>
                                            </button>
                                            <span className="mx-3">{item.quantity}</span>
                                            <button 
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <i className="fas fa-plus text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                        <button 
                                            className="text-red-500 hover:text-red-700 mt-2"
                                            onClick={() => {
                                                removeFromCart(item.id);
                                                showToast(`${item.title} dihapus dari keranjang`, 'success');
                                            }}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Ringkasan Belanja</h2>
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>${getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Biaya Pengiriman</span>
                                <span>Gratis</span>
                            </div>
                            <div className="border-t pt-2 mt-2 mb-4">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>${getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                            <Link 
                                to="/checkout"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full font-medium hover:bg-blue-700 transition inline-block text-center"
                            >
                                <i className="fas fa-credit-card mr-2"></i>
                                Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;