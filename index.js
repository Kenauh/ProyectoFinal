require("dotenv").config();   // Para leer el archivo .env
const express = require("express");
const connectDB = require("./src/config/db");  // Importa la conexión a MongoDB

const app = express();

// Conectar a la base de datos
connectDB();
require("./src/models/collections");

app.get("/", (req, res) => {
  res.send("Servidor funcionando con Express y MongoDB ✔");
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Servidor iniciado en puerto " + process.env.PORT)
);
