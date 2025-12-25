import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Toast from '../components/Toast';

const CheckoutPage = () => {
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    // --- STATE FORM DATA ---
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    });

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = getTotalPrice();

    // --- HANDLER INPUT ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // --- LOGIKA CHECKOUT + VALIDASI ---
    const handleCheckout = (e) => {
        if (e) e.preventDefault(); // Cegah perilaku default browser

        // 1. Validasi Form
        if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.state || !formData.country) {
            showToast('Please fill in your shipping details to proceed.', 'error');
            return; 
        }

        // 2. Generate Link WhatsApp
        const phoneNumber = "628123456789"; 

        let cartMessage = "";
        cartItems.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            cartMessage += `${index + 1}. ${item.title}\n`;
            cartMessage += `   Price: $${item.price} x ${item.quantity} = $${subtotal.toFixed(2)}\n\n`;
        });

        // 3. Format Pesan Shipping
        const shippingDetails = `--- Shipping Details ---\nName: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nAddress: ${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}\nCountry: ${formData.country}`;

        // 4. Gabungkan Pesan
        const fullMessage = `Hello ShopEase, I want to order:\n\n${cartMessage}\n\n${shippingDetails}\n\nTotal Bill: $${totalPrice.toFixed(2)}`;

        // 5. Encode & Buka WA
        const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
        
        // Membuka WA di tab baru
        window.open(waLink, '_blank');

        // 6. Tampilkan Notifikasi Sukses
        showToast('Purchase successful! Your order is being processed by admin', 'success');
        
        // 7. Kosongkan keranjang
        clearCart();

        // 8. Redirect ke Home setelah 3 detik
        setTimeout(() => {
            navigate('/');
        }, 3000);
    };

    return (
        // ROOT CONTAINER
        <div 
            className="min-h-screen flex flex-col relative"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="absolute inset-0 bg-blue-50/50"></div>

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                    
                    {/* TOAST */}
                    {toast && <Toast key={toast.message} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                    <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50 mb-8">
                        
                        <div className="text-center mb-10">
                            <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight drop-shadow-lg">
                                Checkout
                            </h1>
                            <p className="text-slate-700 max-w-2xl mx-auto text-lg drop-shadow-sm">
                                Complete your shipping details below to finalize your order.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            
                            {/* --- LEFT COLUMN: SHIPPING FORM --- */}
                            <div className="lg:col-span-2 space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <i className="fas fa-shipping-fast text-blue-600"></i> Shipping Details
                                </h2>

                                {/* 
                                    PERUBAHAN PENTING: 
                                    Tag <form> diganti dengan <div>.
                                    Ditambahkan onKeyDown agar tombol Enter tetap bisa checkout.
                                */}
                                <div className="space-y-4" onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Mencegah Enter default browser
                                        handleCheckout();
                                    }
                                }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                            <input 
                                                type="text" 
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/50 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition" 
                                                placeholder="John" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                            <input 
                                                type="text" 
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/50 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition" 
                                                placeholder="Doe" 
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <div className="relative">
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pl-11 bg-white/50 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition" 
                                                placeholder="john@example.com" 
                                            />
                                            <i className="fas fa-envelope absolute left-4 top-4 text-slate-400"></i>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                                        <input 
                                            type="text" 
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/50 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition" 
                                            placeholder="1234 Main St" 
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                            <input 
                                                type="text" 
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/50 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition" 
                                                placeholder="New York" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                            <input 
                                                type="text" 
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/50 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition" 
                                                placeholder="NY" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                                            <input 
                                                type="text" 
                                                name="zip"
                                                value={formData.zip}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/50 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition" 
                                                placeholder="10001" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                            <select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/50 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition cursor-pointer"
                                            >
                                                <option value="" disabled>Select Country</option>
                                                <option value="Indonesia">Indonesia</option>
                                                <option value="United States">United States</option>
                                                <option value="Canada">Canada</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Malaysia">Malaysia</option>
                                            </select>
                                        </div>
                                    </div>
                                </div> {/* End Form Div */}
                            </div>
                            
                            {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
                            <div className="lg:col-span-1">
                                <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg border border-white/40 p-6 sticky top-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>
                                    
                                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-white" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800 line-clamp-1 w-24">{item.title}</p>
                                                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-slate-900 text-sm">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-200 pt-4 space-y-3 mb-6">
                                        <div className="flex justify-between text-slate-600">
                                            <span>Total Items ({totalItems})</span>
                                            <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600">
                                            <span>Shipping</span>
                                            <span className="text-green-600 font-bold">Free</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-100">
                                            <span>Total</span>
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* --- BUTTON CHECKOUT WA --- */}
                                    <button 
                                        onClick={handleCheckout}
                                        className="group w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                                    >
                                        <i className="fab fa-whatsapp"></i> 
                                        Checkout via WhatsApp
                                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                    </button>
                                    
                                    <div className="flex justify-center gap-4 mt-6">
                                        <div className="w-10 h-6 bg-slate-200 rounded"></div>
                                        <div className="w-10 h-6 bg-slate-200 rounded"></div>
                                        <div className="w-10 h-6 bg-green-500 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;