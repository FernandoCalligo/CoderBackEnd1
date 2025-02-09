import fs from 'fs';

export class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getProducts() {
        try {
            if (!fs.existsSync(this.path)) return [];
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer los productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        /* console.log(products) */
        return products.find(prod => prod.id === id) || null;
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = { id: products.length + 1, ...product };
        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        let products = await this.getProducts();
        const index = products.findIndex(prod => prod.id === id);
        if (index === -1) return null;
        
        products[index] = { ...products[index], ...updatedFields, id };
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const newProducts = products.filter(prod => prod.id !== id);
        if (products.length === newProducts.length) return null;
        
        await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2));
        return true;
    }
}