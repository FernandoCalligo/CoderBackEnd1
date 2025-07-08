import { Router } from 'express';
import Product from '../models/Product.js'; // Importar el modelo de Mongoose
import { ProductManager } from '../models/ProductManager.js';

const router = Router();
const productManager = new ProductManager();
// obtener todos los productos con paginación, filtros y ordenamiento

router.get('/', async (req, res) => {
    const { limit = 20, page = 1, sort, query } = req.query;

    try {
        const result = await productManager.getProducts({ limit, page, sort, query });
        res.json(result); // Devuelve los productos en formato JSON
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al cargar los productos');
    }
});


// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await Product.findById(pid).lean(); // Convertir a objeto plano
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('productDetails', { product });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al cargar el producto');
    }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        // Validar los datos
        if (!title || !description || !code || !price || !status || !stock || !category) {
            return res.status(400).json({ status: "error", message: "Todos los campos son obligatorios" })
        }

        // Crear el producto
        const newProduct = new Product({ title, description, code, price, status, stock, category, thumbnails });
        await newProduct.save();

        res.status(201).json({ status: "success", message: "Producto agregado correctamente", payload: newProduct })
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" })
    }
});

// Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" })

        res.json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al actualizar el producto" })
    }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.pid);
        if (!result) return res.status(404).json({ status: "error", message: "Producto no encontrado" })

        res.json({ status: "success", message: "Producto eliminado correctamente" })
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al eliminar el producto" })
    }
});

export default router;
