import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 1. PERBAIKAN: Fungsi untuk mengambil data awal dari localStorage
// Ini memastikan cart tidak hilang saat user refresh halaman
const getInitialState = () => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        try {
            return { cartItems: JSON.parse(savedCart) };
        } catch (error) {
            console.error('Gagal membaca cart dari localStorage:', error);
            return { cartItems: [] };
        }
    }
    return { cartItems: [] };
};

// Definisikan tipe aksi
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

// Fungsi Reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const existingItem = state.cartItems.find(item => item.id === action.payload.id);
            
            if (existingItem) {
                // Jika produk sudah ada, tambahkan jumlahnya
                return {
                    ...state,
                    cartItems: state.cartItems.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            } else {
                // Jika produk belum ada, tambahkan ke keranjang
                return {
                    ...state,
                    cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
                };
            }
            
        case REMOVE_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload),
            };
            
        case UPDATE_QUANTITY:
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
            
        case CLEAR_CART:
            // Reset cart menjadi kosong
            return {
                ...state,
                cartItems: [],
            };
            
        default:
            return state;
    }
};

// Buat Context
const CartContext = createContext();

// Komponen Provider
export const CartProvider = ({ children }) => {
    // 2. PERBAIKAN: Gunakan getInitialState di sini (argumen ke-3 useReducer)
    const [state, dispatch] = useReducer(cartReducer, getInitialState());

    // Simpan cartItems ke localStorage setiap kali ada perubahan
    // Ini menjamin perubahan tersimpan (tambah, hapus, update, clear)
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }, [state.cartItems]);

    // Fungsi untuk menambah produk ke keranjang
    const addToCart = (product) => {
        dispatch({ type: ADD_TO_CART, payload: product });
    };

    // Fungsi untuk menghapus produk dari keranjang (per item)
    const removeFromCart = (productId) => {
        dispatch({ type: REMOVE_FROM_CART, payload: productId });
    };

    // Fungsi untuk memperbarui jumlah produk
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            dispatch({ type: UPDATE_QUANTITY, payload: { id: productId, quantity } });
        }
    };

    // Fungsi untuk mengosongkan keranjang
    // Fungsi ini HANYA akan dipanggil di CheckoutPage saat sukses
    const clearCart = () => {
        dispatch({ type: CLEAR_CART });
    };

    // Fungsi untuk menghitung total harga
    const getTotalPrice = () => {
        return state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Fungsi untuk menghitung total jumlah item
    const getTotalItems = () => {
        return state.cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems: state.cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalPrice,
                getTotalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};