// src/components/FilterControls.jsx
import React from 'react';

const FilterControls = ({ 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory, 
    categories 
}) => {
    return (
        <div className="mb-8 flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                </div>
            </div>
            
            {/* Category Dropdown */}
            <div className="w-full md:w-64">
                <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">Semua Kategori</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FilterControls;