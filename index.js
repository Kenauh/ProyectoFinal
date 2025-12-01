require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); 
const connectDB = require("./src/config/db");

// Importamos TODOS los modelos
const { User, Compra, Comprador, Especie, Lote, Tipo } = require("./src/models/collections");

const app = express();

/* ======================================================
   MIDDLEWARE
====================================================== */
app.use(cors());
app.use(express.json());
app.use("/img", express.static("public/img"));

/* ======================================================
   CONEXIÓN A LA BASE DE DATOS
====================================================== */
connectDB();

/* ======================================================
   RUTAS MODULARES
====================================================== */
app.use("/api/compras", require("./src/routes/comprasRoutes"));
app.use("/api/especies", require("./src/routes/especiesRoutes"));

/* ======================================================
   RUTA 1: LOGIN
====================================================== */
app.post("/api/login", async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const user = await User.findOne({ correo });
        if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        const esCorrecta = await bcrypt.compare(contraseña, user.contraseña);
        if (!esCorrecta) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

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
   RUTA 2: REGISTRO
====================================================== */
app.post("/api/register", async (req, res) => {
    try {
        const { nombre, apellido_paterno, apellido_materno, direccion, correo, contraseña } = req.body;

        const existe = await User.findOne({ correo });
        if (existe) return res.status(400).json({ mensaje: "El correo ya está registrado" });

        const salt = await bcrypt.genSalt(10); 
        const passwordHash = await bcrypt.hash(contraseña, salt); // Crea el hash

        const nuevoUsuario = new User({ 
            nombre, 
            correo, 
            contraseña: passwordHash, 
            rol: "cliente" 
        });
        await nuevoUsuario.save();

     
        const codigo_cpr = Math.floor(Math.random() * 9000) + 1000;
        const comprador = new Comprador({ codigo_cpr, nombre, apellido_paterno, apellido_materno, direccion, correo });
        await comprador.save();

        res.json({ mensaje: "Usuario registrado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error en el registro" });
    }
});

/* ======================================================
   RUTA 3: REPORTE VENTAS
====================================================== */
app.get("/api/compras-admin", async (req, res) => {
    try {
        const compras = await Compra.find();
        const result = [];
        for (let compra of compras) {
            const comprador = await Comprador.findOne({ codigo_cpr: compra.codigo_cpr });
            result.push({ ...compra._doc, comprador_relacionado: comprador || null });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener compras" });
    }
});

/* ======================================================
   RUTA 4: CREAR ADMIN 
====================================================== */
app.get("/crear-admin", async (req, res) => {
    try {
       
        await User.deleteOne({ correo: "admin@lonja.com" });

       
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash("123", salt);

        const admin = new User({
            nombre: "Jefe Lonja",
            correo: "admin@lonja.com",
            contraseña: passwordHash, 
            rol: "admin"
        });

        await admin.save();
        res.send("Administrador actualizado con seguridad Bcrypt ✔");

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

/* ======================================================
   OTRAS RUTAS DE SOPORTE
====================================================== */
app.get("/api/compradores", async (req, res) => {
    try {
        const compradores = await Comprador.find();
        res.json(compradores);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo compradores" });
    }
});

app.get("/crear-productos", async (req, res) => {
   
    res.send("Productos verificados.");
});
/* ======================================================
   RUTA DE LIMPIEZA: BORRAR USUARIOS ANTIGUOS
====================================================== */
app.get("/limpiar-usuarios", async (req, res) => {
    try {
     
        await User.deleteMany({});
        await Comprador.deleteMany({});
        
        res.send("¡Limpieza completa! Usuarios antiguos eliminados. Ahora crea uno nuevo.");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});
app.listen(process.env.PORT || 3000, () =>
    console.log(`Servidor Backend corriendo en puerto ${process.env.PORT || 3000}`)
);