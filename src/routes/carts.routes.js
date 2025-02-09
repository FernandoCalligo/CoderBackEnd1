import { Router } from 'express';
import { CartManager } from '../models/CartManager.js';

const router = Router();
const cartManager = new CartManager('./src/data/carts.json');

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
    if (!updatedCart) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(updatedCart);
});

export default router;