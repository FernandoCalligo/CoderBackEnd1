import { Router } from "express";
import User from "../models/User.js";
import { isValidPassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";

const router = Router();
const JWT_SECRET = "coderSecret"; // Usa variable de entorno en producción

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !isValidPassword(user, password)) {
        return res.status(401).json({ status: "error", message: "Credenciales inválidas" });
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ status: "success", token });
});

// Ruta protegida: /current
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({ status: "success", user: req.user });
});

export default router;