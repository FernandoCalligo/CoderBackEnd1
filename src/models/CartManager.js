import fs from 'fs';

export class CartManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getCarts() {
        try {
            if (!fs.existsSync(this.path)) return [];
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer los carritos:', error);
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id) || null;
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: carts.length + 1, products: [] };
        /* console.log(newCart) */
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) return null;
        
        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(prod => prod.product === productId);
        
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        
        carts[cartIndex] = cart;
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}
