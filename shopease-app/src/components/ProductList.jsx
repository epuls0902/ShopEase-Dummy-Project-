import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import { api } from '../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchProducts();
    }, []);

    // Reset ke halaman 1 saat search atau category berubah
    useEffect(() => {
        setCurrentPage(1);
        // Scroll ke atas hanya saat berubah filter, UX biasanya lebih baik jika ke atas saat ganti kategori
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [searchTerm, selectedCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data.products);
            const uniqueCategories = [...new Set(data.products.map(product => product.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching products:', error);
            setToast({ message: 'Failed to load products', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        // PERUBAHAN: Menghapus window.scrollTo agar tidak scroll ke atas saat ganti halaman
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const bgImage = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop";

    return (
        <div 
            className="h-auto w-full flex flex-col relative overflow-x-hidden"
            style={{
                backgroundImage: `url('${bgImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-blue-50/50"></div>

            {/* CONTENT WRAPPER */}
            <div className="relative z-10 flex-1 flex flex-col">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                    
                    {/* TOAST */}
                    {toast && <Toast key={toast.message} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                    
                    {/* HEADER SECTION */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight drop-shadow-lg">
                            Product Catalog
                        </h1>
                        <p className="text-slate-700 max-w-2xl mx-auto text-lg drop-shadow-sm">
                            Discover our best collection at affordable prices.
                        </p>
                    </div>
                    
                    {/* UI FILTER & SEARCH */}
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 mb-12">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className={`fas fa-search text-lg transition-colors duration-300 ${searchTerm ? 'text-blue-600' : 'text-slate-400 group-focus-within:text-blue-500'}`}></i>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-12 pr-4 py-3.5 bg-transparent border-2 border-slate-300 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all duration-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <i className="fas fa-times-circle text-lg"></i>
                                    </button>
                                )}
                            </div>
                            
                            <div className="relative w-full md:w-72 group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-filter text-lg text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300"></i>
                                </div>
                                <select
                                    className="w-full pl-12 pr-10 py-3.5 bg-transparent border-2 border-slate-300 rounded-xl text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all duration-300 cursor-pointer font-medium"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <i className="fas fa-chevron-down text-xs text-slate-500"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64 flex-1">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-slate-800 drop-shadow-md"></div>
                        </div>
                    ) : (
                        <>
                            {/* 
                                KUNCI PERBAIKAN ERROR: 
                                key={currentPage} dipertahankan agar React me-render ulang grid 
                                dan mencegah error layout saat ganti halaman tanpa scroll.
                            */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12" key={currentPage}>
                                {currentItems.map(product => (
                                    <ProductCard key={product.id} product={product} showToast={showToast} />
                                ))}
                            </div>
                            
                            {/* UI PAGINATION */}
                            {filteredProducts.length > 0 && totalPages > 1 && (
                                <div className="flex flex-col items-center gap-4 pb-8">
                                    <div className="flex gap-2 overflow-x-auto pb-2 w-full justify-center">
                                        <button
                                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`px-6 py-3 border rounded-xl transition-all font-bold ${
                                                currentPage === 1 
                                                ? 'bg-white/20 text-slate-500 cursor-not-allowed border-transparent backdrop-blur-sm' 
                                                : 'bg-white text-blue-700 hover:bg-blue-50 border-white shadow-lg hover:shadow-xl'
                                            }`}
                                        >
                                            Prev
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center font-bold whitespace-nowrap ${
                                                        currentPage === pageNum
                                                        ? 'bg-blue-600 text-white shadow-xl scale-110'
                                                        : 'bg-white/80 text-slate-800 hover:bg-white hover:shadow-lg border-white backdrop-blur-sm'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`px-6 py-3 border rounded-xl transition-all font-bold ${
                                                currentPage === totalPages 
                                                ? 'bg-white/20 text-slate-500 cursor-not-allowed border-transparent backdrop-blur-sm' 
                                                : 'bg-white text-blue-700 hover:bg-blue-50 border-white shadow-lg hover:shadow-xl'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 drop-shadow-md tracking-wide">
                                        Page {currentPage} of {totalPages}
                                    </p>
                                </div>
                            )}
                            
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="bg-white/30 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/40">
                                        <i className="fas fa-search text-4xl text-slate-800"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2 drop-shadow-md">Product Not Found</h3>
                                    <p className="text-slate-800 text-lg">Try changing your search keywords or category.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;