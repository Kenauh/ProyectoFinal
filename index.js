/* Archivo: index.js (Backend) */
require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const connectDB = require("./src/config/db");

const app = express();

app.use(cors()); 
app.use(express.json());

connectDB();

// ==========================================
// IMPORTACIÓN DE MODELOS (Corrección aquí)
// Importamos User y Compra UNA SOLA VEZ
// ==========================================
const { User, Compra } = require("./src/models/collections");

// ==========================================
// RUTA 1: LOGIN
// ==========================================
app.post("/api/login", async (req, res) => {
    const { correo, contraseña } = req.body;
    try {
        // Busca usuario por correo
        const user = await User.findOne({ correo });
        if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        // Valida contraseña
        if (user.contraseña !== contraseña) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // Responde con el rol
        res.json({ 
            mensaje: "Login exitoso", 
            nombre: user.nombre, 
            rol: user.rol 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// RUTA 2: OBTENER COMPRAS (Para el Admin)
// ==========================================
app.get("/api/compras", async (req, res) => {
    try {
        // Buscamos todas las compras y llenamos los datos del comprador
        const compras = await Compra.find().populate("comprador_relacionado", "nombre apellido_paterno");
        res.json(compras);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener compras" });
    }
});

// ==========================================
// RUTA 3: CREAR ADMIN (Temporal para pruebas)
// ==========================================
app.get("/crear-admin", async (req, res) => {
    try {
        const nuevoAdmin = new User({
            nombre: "Jefe Lonja",
            correo: "admin@lonja.com",
            contraseña: "123",
            rol: "admin"
        });
        await nuevoAdmin.save();
        res.send("¡Usuario Admin creado con éxito!");
    } catch (error) {
        res.send("Error (probablemente ya existe): " + error.message);
    }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Servidor Backend en puerto " + (process.env.PORT || 3000))
);