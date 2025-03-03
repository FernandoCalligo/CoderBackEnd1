import { Router } from 'express';
import { ProductManager } from '../models/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    /* console.log("Quiero conocer un prodcto por id") */
    const product = await productManager.getProductById(parseInt(req.params.pid));
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || status === undefined || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const newProduct = await productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
    res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
    if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
    const result = await productManager.deleteProduct(parseInt(req.params.pid));
    if (!result) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
});

export default router;