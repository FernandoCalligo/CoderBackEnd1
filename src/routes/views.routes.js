import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

// Renderiza la vista home con productos desde MongoDB
router.get('/', async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 6;

    try {
        const options = {
            limit,
            page,
            lean: true
        };

        const result = await Product.paginate({}, options);
        res.render('home', {
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error al cargar los productos");
    }
});

// Renderiza la vista realTimeProducts
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// Renderiza la vista productDetails para un producto específico
router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await Product.findById(pid).lean();
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('productDetails', { product });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send("Error al cargar el producto");
    }
});

//Renderiza la vista cartDetails para un carrito específico
router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate('products.product').lean()
        if (!cart) {
            return res.status(404).send('Carrito no encontrado')
        }
        res.render('cartDetails', { cart })
    } catch (error) {
        console.error("Error al obtener el carrito:", error)
        res.status(500).send("Error al cargar el carrito")
    }
});

// Renderiza la vista de registro
router.get('/login', (req, res) => {
    res.render('login');
});

export default router;