export const api = {
    getProducts: async () => {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) throw new Error('Gagal mengambil data produk');
        return await response.json();
    },
    getProductById: async (id) => {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil detail produk');
        return await response.json();
    }
};