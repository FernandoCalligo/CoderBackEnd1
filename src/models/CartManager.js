import mongoose from "mongoose";
import Cart from "../models/Cart.js";

export class CartManager {
    constructor() {}

    // Obtener todos los carritos
    // Solucion a un problema que estaba teniendo con mongo
    async getCarts() {
        try {
            return await Cart.find().populate("products.product");
        } catch (error) {
            console.error("Error al obtener los carritos:", error);
            return [];
        }
    }

    // lo mismo aca

    async hasCarts() {
        try {
            return (await Cart.countDocuments()) > 0;
        } catch (error) {
            console.error("Error al verificar si hay carritos:", error);
            return false;
        }
    }

    // Funcion para obtener carrito mediante el ID
    async getCartById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("ID de carrito inválido");
            return null;
        }

        try {
            return await Cart.findById(id).populate("products.product");
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return null;
        }
    }

    // Funcion para Crear Carrito vacio
    async createCart() {
        try {
            const newCart = await Cart.create({ products: [] });
            console.log("Carrito creado:", newCart);
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            return null;
        }
    }

    // Funcion para agregar un producto al carrito
    async addProductToCart(cartId, productId) {
        if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
            console.error("ID de carrito o producto inválido");
            return null;
        }

        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                console.error("Carrito no encontrado");
                return null;
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1; // Incrementar cantidad si el producto ya existe
            } else {
                cart.products.push({ product: productId, quantity: 1 }); // Agregar nuevo producto
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            return null;
        }
    }

    // Funcion para actualizar el carrito con una lista de productos
    async updateCart(cartId, products) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            console.error("ID de carrito inválido");
            return null;
        }

        try {
            return await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            return null;
        }
    }

    // Funcion para atualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
            console.error("ID de carrito o producto inválido");
            return null;
        }

        if (quantity < 0) {
            console.error("La cantidad no puede ser negativa");
            return null;
        }

        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                console.error("Carrito no encontrado");
                return null;
            }

            const product = cart.products.find(p => p.product.toString() === productId);
            if (product) {
                product.quantity = quantity;
                await cart.save();
                return cart;
            } else {
                console.error("Producto no encontrado en el carrito");
                return null;
            }
        } catch (error) {
            console.error("Error al actualizar la cantidad:", error);
            return null;
        }
    }

    // Eliminar un producto del carrito
    async deleteProductFromCart(cartId, productId) {
        if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
            console.error("ID de carrito o producto inválido");
            return null;
        }

        try {
            return await Cart.findByIdAndUpdate(
                cartId,
                { $pull: { products: { product: productId } } },
                { new: true }
            );
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            return null;
        }
    }

    // Vaciar un carrito
    async deleteCart(cartId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            console.error("ID de carrito inválido");
            return null;
        }

        try {
            return await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            return null;
        }
    }
}