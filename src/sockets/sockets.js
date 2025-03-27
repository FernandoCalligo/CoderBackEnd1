import { ProductManager } from '../models/ProductManager.js';

const productManager = new ProductManager();

export default function configureSockets(io) {
    io.on('connection', async (socket) => {
        console.log('Nuevo cliente conectado');

        // Enviar productos al cliente
        const products = await productManager.getProducts({});
        socket.emit('updateProducts', products.payload);

        // Escuchar cuando se añade un producto
        socket.on('addProduct', async (product) => {
            await productManager.addProduct(product);
            const updatedProducts = await productManager.getProducts({});
            io.emit('updateProducts', updatedProducts.payload);
        });

        // Enviar productos al cargar la página
        socket.on('requestProducts', async () => {
            const products = await productManager.getProducts({});
            socket.emit('updateProducts', products.payload);
        });
    });
}
