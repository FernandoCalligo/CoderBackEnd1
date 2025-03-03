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
        try {
            const products = await this.getProducts();
            return products.find(prod => prod.id === id) || null;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            return null;
        }
    }

    async addProduct(product) {
        try {
            if (product.stock < 0 || product.code < 0) {
                throw new Error('El stock y el código deben ser números positivos');
            }
            const products = await this.getProducts();
            const newProduct = { id: products.length + 1, ...product };
            products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            if (updatedFields.stock < 0 || updatedFields.code < 0) {
                throw new Error('El stock y el código deben ser números positivos');
            }
            let products = await this.getProducts();
            const index = products.findIndex(prod => prod.id === id);
            if (index === -1) return null;

            products[index] = { ...products[index], ...updatedFields, id };
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[index];
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            const newProducts = products.filter(prod => prod.id !== id);
            if (products.length === newProducts.length) return null;

            await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2));
            return true;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return false;
        }
    }
}