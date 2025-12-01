/* ======================================================
   Archivo: index.js — Backend principal
====================================================== */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

// Modelos
const { User, Compra, Comprador } = require("./src/models/collections");

const app = express();

/* ======================================================
   MIDDLEWARE
====================================================== */
app.use(cors());
app.use(express.json());

// Archivos estáticos (imágenes de especies)
app.use("/img", express.static("public/img"));

/* ======================================================
   CONEXIÓN A LA BASE DE DATOS
====================================================== */
connectDB();

/* ======================================================
   RUTAS EXTERNAS
====================================================== */
app.use("/api/compras", require("./src/routes/comprasRoutes"));
app.use("/api/especies", require("./src/routes/especiesRoutes"));

/* ======================================================
   RUTA: LOGIN
====================================================== */
app.post("/api/login", async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const user = await User.findOne({ correo });
        if (!user)
            return res.status(404).json({ mensaje: "Usuario no encontrado" });

        if (user.contraseña !== contraseña)
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });

        // Buscar comprador relacionado con ese correo
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

/* ======================================================
   RUTA: REGISTRO (Crear User + Comprador)
====================================================== */
app.post("/api/register", async (req, res) => {
    try {
        const {
            nombre,
            apellido_paterno,
            apellido_materno,
            direccion,
            correo,
            contraseña
        } = req.body;

        // Validar si el correo ya existe
        const existe = await User.findOne({ correo });
        if (existe) {
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

        // Crear usuario
        const nuevoUsuario = new User({
            nombre,
            correo,
            contraseña,
            rol: "cliente"
        });

        await nuevoUsuario.save();

        // Generar código único para comprador
        const codigo_cpr = Math.floor(Math.random() * 9000) + 1000;

        // Crear comprador
        const comprador = new Comprador({
            codigo_cpr,
            nombre,
            apellido_paterno,
            apellido_materno,
            direccion,
            correo
        });

        await comprador.save();

        res.json({ mensaje: "Usuario registrado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error en el registro" });
    }
});

/* ======================================================
   RUTA: LISTA DE COMPRAS PARA ADMIN PANEL
====================================================== */
app.get("/api/compras-admin", async (req, res) => {
    try {
        const compras = await Compra.find();
        const result = [];

        for (let compra of compras) {
            const comprador = await Comprador.findOne({
                codigo_cpr: compra.codigo_cpr
            });

            result.push({
                ...compra._doc,
                comprador_relacionado: comprador || null
            });
        }

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener compras" });
    }
});

/* ======================================================
   RUTA: CREAR ADMIN (SOLO PARA PRUEBAS)
====================================================== */
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

/* ======================================================
   INICIAR SERVIDOR
====================================================== */
app.listen(process.env.PORT || 3000, () =>
    console.log(`Servidor Backend corriendo en puerto ${process.env.PORT || 3000}`)
);
