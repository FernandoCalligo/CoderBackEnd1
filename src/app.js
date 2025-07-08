import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import { create } from 'express-handlebars';
import productsRouter from './routes/products.routes.js'; // Rutas de la API de productos
import cartsRouter from './routes/carts.routes.js'; // Rutas de la API de carritos
import viewsRouter from './routes/views.routes.js'; // Rutas para las vistas
import usersRouter from './routes/users.routes.js'; // Rutas de usuarios
import sessionsRouter from './routes/sessions.routes.js'; // Rutas de sesiones
import passport from './config/passport.js'; // Configuración de Passport
import path from 'path';
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import configureSockets from './sockets/sockets.js'
// import { CartManager } from './models/CartManager.js'

// Inicialización de Express
const app = express()
const server = createServer(app)
const io = new Server(server)

// Conexión a MongoDB
const mongoURI = "mongodb://127.0.0.1:27017/"
mongoose.connect(mongoURI)
.then(() => console.log("Conectado a MongoDB"))
.catch(err => console.error("Error al conectar a MongoDB", err))

// Configuración de middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuración de Handlebars
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const hbs = create({
    defaultLayout: false,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'))

// Rutas
app.use('/api/products', productsRouter)// Rutas de la API de productos
app.use('/api/carts', cartsRouter) // Rutas de la API de carritos
app.use('/', viewsRouter) // Rutas para las vistas
app.use(passport.initialize());
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

configureSockets(io)

// const cartManager = new CartManager();
// const cart = await cartManager.hasCarts();
// console.log(cart)

// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});