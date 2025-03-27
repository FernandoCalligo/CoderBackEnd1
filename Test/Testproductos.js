import mongoose from "mongoose"
import Product from "../src/models/Product.js"

const products = [
    { title: "Pelota de Fútbol", description: "Pelota profesional", code: "P001", price: 15000, status: true, stock: 20, category: "Deportes", thumbnails: [] },
    { title: "Zapatillas Running", description: "Zapatillas deportivas", code: "P002", price: 35000, status: true, stock: 15, category: "Calzado", thumbnails: [] },
    { title: "Camiseta de Fútbol", description: "Camiseta oficial", code: "P003", price: 20000, status: true, stock: 30, category: "Ropa", thumbnails: [] },
    { title: "Raqueta de Tenis", description: "Raqueta profesional", code: "P004", price: 50000, status: true, stock: 10, category: "Deportes", thumbnails: [] },
    { title: "Guantes de Boxeo", description: "Guantes de cuero", code: "P005", price: 25000, status: true, stock: 12, category: "Deportes", thumbnails: [] },
    { title: "Mochila Deportiva", description: "Mochila resistente", code: "P006", price: 18000, status: true, stock: 25, category: "Accesorios", thumbnails: [] },
    { title: "Botines de Fútbol", description: "Botines con tapones", code: "P007", price: 40000, status: true, stock: 18, category: "Calzado", thumbnails: [] },
    { title: "Casco de Ciclismo", description: "Casco ultraligero", code: "P008", price: 30000, status: true, stock: 8, category: "Ciclismo", thumbnails: [] },
    { title: "Short Deportivo", description: "Short de secado rápido", code: "P009", price: 12000, status: true, stock: 22, category: "Ropa", thumbnails: [] },
    { title: "Balón de Básquet", description: "Balón oficial NBA", code: "P010", price: 28000, status: true, stock: 15, category: "Deportes", thumbnails: [] },
    { title: "Gorra Deportiva", description: "Gorra ajustable", code: "P011", price: 10000, status: true, stock: 35, category: "Accesorios", thumbnails: [] },
    { title: "Bicicleta de Montaña", description: "Bicicleta con suspensión", code: "P012", price: 150000, status: true, stock: 5, category: "Ciclismo", thumbnails: [] },
];

const testproductos = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/CoderBack");

        await Product.deleteMany()
        await Product.insertMany(products)
        console.log("Productos agregados!")
    } catch (error) {
        console.error("Error al agregar productos:", error)
    } finally {
        mongoose.connection.close()
    }
};

testproductos()
