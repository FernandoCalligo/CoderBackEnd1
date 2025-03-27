import mongoose from 'mongoose';
import Cart from '../src/models/Cart.js';

const mongoURI = "mongodb://127.0.0.1:27017";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error al conectar a MongoDB", err));

async function testCreateCart() {
    try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        console.log("Carrito creado:", newCart);
    } catch (error) {
        console.error("Error al crear el carrito:", error);
    }
}

testCreateCart();