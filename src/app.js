import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import { create } from 'express-handlebars';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from './routes/views.routes.js';
import { ProductManager } from './models/ProductManager.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hbs = create({
    defaultLayout: false
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/', viewsRouter);

const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // envia los productos al cliente
    const products = await productManager.getProducts();
    socket.emit('updateProducts', products);

    // Añade un producto y actualiza la lista de productos 
    socket.on('addProduct', async (product) => {
        const newProduct = await productManager.addProduct(product);
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts); // hace un update de todos los productos
    });

    socket.on('requestProducts', async () => {
        const products = await productManager.getProducts();
        socket.emit('updateProducts', products);
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});