// src/components/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Toast from '../components/Toast';

const CheckoutPage = () => {
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            setToast({ message: 'Keranjang belanja kosong', type: 'error' });
            return;
        }

        setIsProcessing(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            
            // Format pesan untuk WhatsApp
            let orderDetails = cartItems.map(item => 
                `- ${item.title} (${item.quantity} x $${item.price}) = $${(item.price * item.quantity).toFixed(2)}`
            ).join('\n');
            
            const message = `Halo ka, saya ${formData.fullName} dengan email ${formData.email} ingin memesan item berikut:\n\n${orderDetails}\n\nTotal: $${getTotalPrice().toFixed(2)}\n\nTolong dikirim ke alamat ini:\n${formData.address}`;
            
            // Nomor WhatsApp (ganti dengan nomor toko Anda)
            const phoneNumber = "6282123456789"; // Format internasional tanpa tanda + atau 0 di depan
            
            // Buka WhatsApp dengan pesan yang sudah diformat
            window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
            
            // Tampilkan pesan sukses
            setToast({ message: 'Anda diarahkan ke WhatsApp untuk menyelesaikan pesanan', type: 'success' });
            
            // Kosongkan keranjang
            clearCart();
            
            // Tandai pesanan selesai
            setOrderComplete(true);
            
            // Redirect ke home setelah 5 detik
            setTimeout(() => {
                navigate('/');
            }, 5000);
        }, 2000);
    };

    if (orderComplete) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fab fa-whatsapp text-green-500 text-3xl"></i>
                </div>
                <h1 className="text-2xl font-bold mb-2">Pesanan Dikirim ke WhatsApp!</h1>
                <p className="text-gray-600 mb-4">Terima kasih telah berbelanja di ShopEase</p>
                <p className="text-sm text-gray-500">Anda akan diarahkan kembali ke beranda dalam 5 detik...</p>
                <button 
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => navigate('/')}
                >
                    Kembali ke Beranda
                </button>
            </div>
        );
    }

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Informasi Pengiriman</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Alamat</label>
                                <textarea 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    required
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit"
                                className="bg-green-600 text-white px-6 py-3 rounded-lg w-full font-medium hover:bg-green-700 transition"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <i className="fab fa-whatsapp mr-2"></i>
                                        Kirim Pesanan via WhatsApp
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
                
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
                        <div className="mb-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center mb-3">
                                    <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-cover rounded mr-3" />
                                    <div className="flex-grow">
                                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.quantity} x ${item.price}</p>
                                    </div>
                                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>${getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Biaya Pengiriman</span>
                                <span>Gratis</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t">
                                <span>Total</span>
                                <span>${getTotalPrice().toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700">
                                <i className="fas fa-info-circle mr-1"></i>
                                Pesanan Anda akan dikirim melalui WhatsApp untuk proses lebih lanjut
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;