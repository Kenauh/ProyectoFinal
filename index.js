/* Archivo: index.js */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

// Modelos
const { User, Compra, Comprador } = require("./src/models/collections");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la BD
connectDB();

/* ==========================================
   RUTAS DEL PROYECTO
========================================== */
app.use("/api/compras", require("./src/routes/comprasRoutes"));
app.use("/api/especies", require("./src/routes/especiesRoutes"));

/* ==========================================
   RUTA 1: LOGIN (CORREGIDA)
========================================== */
app.post("/api/login", async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Buscar usuario en colección users
        const user = await User.findOne({ correo });
        if (!user)
            return res.status(404).json({ mensaje: "Usuario no encontrado" });

        // Verificar contraseña
        if (user.contraseña !== contraseña)
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });

        // Buscar datos del comprador (para obtener codigo_cpr)
        const comprador = await Comprador.findOne({ correo });

        res.json({
            mensaje: "Login exitoso",
            nombre: user.nombre,
            rol: user.rol,
            codigo_cpr: comprador ? comprador.codigo_cpr : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

/* ==========================================
   RUTA 2: OBTENER TODAS LAS COMPRAS (ADMIN)
========================================== */
app.get("/api/compras-admin", async (req, res) => {
    try {
        const compras = await Compra.find();

        const comprasConComprador = [];

        // Asignar manualmente datos del comprador
        for (let compra of compras) {
            const comprador = await Comprador.findOne({
                codigo_cpr: compra.codigo_cpr
            });

            comprasConComprador.push({
                ...compra._doc,
                comprador_relacionado: comprador ?? null
            });
        }

        res.json(comprasConComprador);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener compras" });
    }
});

/* ==========================================
   RUTA 3: CREAR ADMIN (SOLO PRUEBAS)
========================================== */
app.get("/crear-admin", async (req, res) => {
    try {
        const admin = new User({
            nombre: "Jefe Lonja",
            correo: "admin@lonja.com",
            contraseña: "123",
            rol: "admin"
        });

        await admin.save();
        res.send("Administrador creado ✔");

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

/* ==========================================
   INICIAR SERVIDOR
========================================== */
app.listen(process.env.PORT || 3000, () =>
    console.log(`Servidor Backend corriendo en puerto ${process.env.PORT || 3000}`)
);
