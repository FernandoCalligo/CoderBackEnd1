import { Router } from "express";
import User from "../models/User.js";
import { createHash } from "../utils/hash.js";

const router = Router();

// Registro
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, cart } = req.body;
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
        }
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ status: "error", message: "El email ya está registrado" });

        const hashedPassword = createHash(password);
        const user = await User.create({ first_name, last_name, email, age, password: hashedPassword, cart });
        res.status(201).json({ status: "success", payload: user });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al registrar usuario" });
    }
});

// Obtener todos los usuarios
router.get("/", async (req, res) => {
    const users = await User.find();
    res.json({ status: "success", payload: users });
});

// Actualizar usuario
router.put("/:uid", async (req, res) => {
    const { uid } = req.params;
    const update = req.body;
    if (update.password) update.password = createHash(update.password);
    const user = await User.findByIdAndUpdate(uid, update, { new: true });
    res.json({ status: "success", payload: user });
});

// Eliminar usuario
router.delete("/:uid", async (req, res) => {
    const { uid } = req.params;
    await User.findByIdAndDelete(uid);
    res.json({ status: "success", message: "Usuario eliminado" });
});

export default router;