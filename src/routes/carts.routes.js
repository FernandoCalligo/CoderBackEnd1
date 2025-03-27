import { Router } from "express";
import { CartManager } from "../models/CartManager.js";

    const router = Router();
    const cartManager = new CartManager();

    // Obtener carrito por ID
    router.get("/:cid", async (req, res) => {
        try {
            const cart = await cartManager.getCartById(req.params.cid);
            if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            res.json({ status: "success", payload: cart });
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            res.status(500).json({ status: "error", message: "Error interno del servidor" });
        }
    });

    // Crear un nuevo carrito vacio
    router.post("/", async (req, res) => {
        console.log("Solicitud recibida en /api/carts");
        try {
            const newCart = await cartManager.createCart();
            console.log("Nuevo carrito creado:", newCart);
            if (!newCart) {
                return res.status(500).json({ status: "error", message: "No se pudo crear el carrito" });
            }
            res.status(201).json({ status: "success", cartId: newCart._id });
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            res.status(500).json({ status: "error", message: "Error al crear el carrito" });
        }
    });

    // Agregar producto al carrito por ID
    router.post("/:cid/products/:pid", async (req, res) => {
        try {
            const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
            if (!cart) return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado" });
            res.json({ status: "success", message: "Producto agregado", payload: cart });
        } catch (error) {
            console.error("Error al agregar producto:", error);
            res.status(500).json({ status: "error", message: "Error interno del servidor" });
        }
    });

    // Vaciar un carrito
    router.delete("/:cid", async (req, res) => {
        try {
            const emptiedCart = await cartManager.deleteCart(req.params.cid);
            if (!emptiedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            res.json({ status: "success", message: "Carrito vaciado" });
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            res.status(500).json({ status: "error", message: "Error interno del servidor" });
        }
    });

    // actualizar productos en el carrito
    router.put("/:cid", async (req, res) => {
        try {
            const updatedCart = await cartManager.updateCart(req.params.cid, req.body.products);
            if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            res.json({ status: "success", message: "Carrito actualizado", payload: updatedCart });
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            res.status(500).json({ status: "error", message: "Error interno del servidor" });
        }
    });

    // Actualizar cantidad de un producto en el carrito
    router.put("/:cid/products/:pid", async (req, res) => {
        try {
            const { quantity } = req.body;
            if (!quantity || isNaN(quantity) || quantity < 1) {
                return res.status(400).json({ status: "error", message: "Cantidad inválida" });
            }
            const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
            if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado" });
            res.json({ status: "success", message: "Cantidad actualizada", payload: updatedCart });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto:", error);
            res.status(500).json({ status: "error", message: "Error interno del servidor" });
        }
    });

    // eliminar un producto del carrito
    router.delete("/:cid/products/:pid", async (req, res) => {
        try {
            const updatedCart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
            if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado" });
            res.json({ status: "success", message: "Producto eliminado", payload: updatedCart });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            res.status(500).json({ status: "error", message: "Error interno del servidor" });
        }
    });

    export default router;
