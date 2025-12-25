import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Toast from '../components/Toast';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
    const [toast, setToast] = useState(null);

    // State untuk menampung nilai input sementara
    const [inputValues, setInputValues] = useState({});

    useEffect(() => {
        const newValues = {};
        cartItems.forEach(item => {
             newValues[item.id] = item.quantity;
        });
        setInputValues(newValues);
    }, [cartItems]);

    // --- STATE UNTUK KONFIRMASI MODAL ---
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmData, setConfirmData] = useState({ title: '', message: '', action: null });
    const [skipConfirmation, setSkipConfirmation] = useState(false);

    useEffect(() => {
        const savedPreference = localStorage.getItem('skipCartConfirmation');
        if (savedPreference === 'true') {
            setSkipConfirmation(true);
        }
    }, []);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleInputChange = (id, value) => {
        setInputValues(prev => ({ ...prev, [id]: value }));
    };

    const handleInputBlur = (item) => {
        const inputValue = parseInt(inputValues[item.id]);

        if (!inputValue || isNaN(inputValue)) {
            setInputValues(prev => ({ ...prev, [item.id]: item.quantity }));
            return;
        }

        if (inputValue === 0) {
            setInputValues(prev => ({ ...prev, [item.id]: item.quantity }));
            handleRemove(item);
            return;
        }

        let finalValue = inputValue;
        
        if (inputValue > item.stock) {
            finalValue = item.stock;
            showToast(`Maximum available stock is ${item.stock}`, 'info');
        } 
        else if (inputValue < 1) {
            finalValue = 1;
        }

        if (inputValue !== finalValue) {
            setInputValues(prev => ({ ...prev, [item.id]: finalValue }));
        }

        if (finalValue === item.quantity) return;

        handleQuantityChange(item, finalValue);
    };

    const handleRemove = (item) => {
        const removeAction = () => {
            removeFromCart(item.id);
            showToast(`${item.title} removed from cart`, 'success');
        };

        if (skipConfirmation) {
            removeAction();
        } else {
            setConfirmData({
                title: 'Remove Product?',
                message: `Are you sure you want to remove "${item.title}" from your cart?`,
                action: removeAction
            });
            setShowConfirm(true);
        }
    };

    const handleQuantityChange = (item, newQty) => {
        if (newQty > item.stock) {
            showToast(`The requested quantity exceeds available stock`, 'error');
            return;
        }

        const updateAction = () => {
            updateQuantity(item.id, newQty);
            showToast(`Quantity updated to ${newQty}`, 'success');
        };

        if (skipConfirmation) {
            updateAction();
        } else {
            setConfirmData({
                title: 'Update Quantity?',
                message: `Are you sure you want to change the quantity of ${item.title} to ${newQty}?`,
                action: updateAction
            });
            setShowConfirm(true);
        }
    };

    const handleConfirm = () => {
        if (confirmData.action) {
            confirmData.action();
        }
        if (skipConfirmation) {
            localStorage.setItem('skipCartConfirmation', 'true');
        }
        setShowConfirm(false);
    };

    const handleCloseModal = () => {
        setShowConfirm(false);
        const resetValues = {};
        cartItems.forEach(item => {
            resetValues[item.id] = item.quantity;
        });
        setInputValues(resetValues);
    };

    // URL Background Gambar (Sama dengan ProductList)
    const bgImage = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop";

    return (
        // CONTAINER UTAMA (FULL BACKGROUND IMAGE)
        <div 
            className="min-h-screen flex flex-col relative"
            style={{
                backgroundImage: `url('${bgImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* Overlay Biru Muda Agar Teks Terbaca */}
            <div className="absolute inset-0 bg-blue-50/50"></div>

            {/* CONTENT WRAPPER */}
            <div className="relative z-10 flex-1 flex flex-col">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                    
                    {/* HEADER SECTION (Sesuai ProductList) */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight drop-shadow-lg">
                            Shopping Cart
                        </h1>
                        <p className="text-slate-700 max-w-2xl mx-auto text-lg drop-shadow-sm">
                            Manage your items and proceed to secure checkout.
                        </p>
                    </div>
                    
                    {/* --- GLASSMORPHISM CONTAINER (Pembungkus Konten Utama) --- */}
                    <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 mb-8">
                        
                        {cartItems.length === 0 ? (
                            // EMPTY STATE
                            <div className="text-center py-20">
                                <div className="bg-white/30 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/40">
                                    <i className="fas fa-shopping-basket text-4xl text-slate-800"></i>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2 drop-shadow-md">Your Cart is Empty</h2>
                                <p className="text-slate-700 mb-8 text-lg">It seems you haven't added your favorite items yet.</p>
                                <Link to="/" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center gap-2">
                                    <i className="fas fa-arrow-left"></i> Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            // LIST ITEM & SUMMARY
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                <div className="lg:col-span-2 space-y-6">
                                    {cartItems.map(item => {
                                        const isMaxStock = item.quantity >= item.stock;
                                        
                                        return (
                                            <div key={item.id} className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                                                {/* Tombol Hapus */}
                                                <button 
                                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors z-10"
                                                    onClick={() => handleRemove(item)}
                                                    title="Remove Product"
                                                >
                                                    <i className="fas fa-trash-alt text-lg"></i>
                                                </button>

                                                <div className="flex flex-col md:flex-row gap-6">
                                                    <div className="w-full md:w-32 h-32 flex-shrink-0">
                                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500" />
                                                    </div>
                                                    
                                                    <div className="flex-1 w-full flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start pr-8">
                                                                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug">{item.title}</h3>
                                                            </div>
                                                            <p className="text-blue-600 font-extrabold text-2xl mt-2">${item.price}</p>
                                                            
                                                            <div className="mt-3 inline-flex items-center">
                                                                {isMaxStock ? (
                                                                    <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                                                                        <i className="fas fa-exclamation-circle mr-1"></i> Stock Full
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                                        <i className="fas fa-box mr-1"></i> Available Stock: {item.stock - item.quantity}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                                                            
                                                            <div className="bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-inner">
                                                                <input 
                                                                    type="number"
                                                                    max={item.stock}
                                                                    className="w-20 px-3 py-2 text-center font-bold text-gray-800 bg-transparent border-none focus:ring-0"
                                                                    value={inputValues[item.id] || item.quantity}
                                                                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                                                                    onBlur={() => handleInputBlur(item)}
                                                                    onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                                                                />
                                                            </div>

                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Subtotal</p>
                                                                <p className="font-black text-xl text-gray-900">
                                                                    ${(item.price * item.quantity).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="lg:col-span-1">
                                    <div className="bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30 p-6 sticky top-8">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <i className="fas fa-receipt text-blue-500"></i> Order Summary
                                        </h2>
                                        
                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between items-center text-gray-600">
                                                <span className="font-medium">Subtotal</span>
                                                <span className="font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-gray-600">
                                                <span className="font-medium">Shipping Cost</span>
                                                <div className="flex items-center text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg text-sm">
                                                    <i className="fas fa-truck mr-2"></i> Free
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-slate-900 shadow-inner border border-white/40 mb-8">
                                            <div className="flex justify-between items-end">
                                                <span className="text-blue-100 font-medium mb-1">Total Bill</span>
                                                <span className="text-3xl font-black tracking-tight">${getTotalPrice().toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        <Link 
                                            to="/checkout"
                                            className="group w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-black hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                        >
                                            Checkout Now
                                            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                        </Link>
                                        
                                        <p className="text-center text-xs text-slate-600 mt-4">
                                            <i className="fas fa-lock mr-1"></i> Your Transaction is Safe & Encrypted
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODAL KONFIRMASI (Sesuai ProductList) --- */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all scale-100">
                        <div className="text-center mb-8">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                                confirmData.title.includes('Remove') ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'
                            }`}>
                                <i className={`fas ${confirmData.title.includes('Remove') ? 'fa-trash-alt' : 'fa-check-circle'} text-3xl`}></i>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{confirmData.title}</h3>
                            <p className="text-gray-600 leading-relaxed px-4">{confirmData.message}</p>
                        </div>

                        <div className="flex items-center justify-center mb-8 px-2">
                            <div className="flex items-center h-5">
                                <input 
                                    id="skipConfirm" 
                                    type="checkbox" 
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    checked={skipConfirmation}
                                    onChange={(e) => setSkipConfirmation(e.target.checked)}
                                />
                            </div>
                            <label htmlFor="skipConfirm" className="ml-3 text-sm text-gray-500 cursor-pointer select-none">
                                Don't show confirmation again
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={handleCloseModal}
                                className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirm}
                                className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                            >
                                Yes, Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;