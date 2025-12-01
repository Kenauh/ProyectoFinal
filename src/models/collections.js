const mongoose = require("mongoose");

/* ============================
   USUARIOS
============================ */
const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: ["cliente", "admin"], default: "cliente" }
});
const User = mongoose.model("User", UserSchema);

/* ============================
   COMPRADORES
============================ */
const CompradorSchema = new mongoose.Schema({
  codigo_cpr: { type: Number, required: true, unique: true },
  nombre: String,
  apellido_paterno: String,
  apellido_materno: String,
  direccion: String,
  correo: String
});
const Comprador = mongoose.model("Comprador", CompradorSchema);

/* ============================
   LOTES
============================ */
const LoteSchema = new mongoose.Schema({
  id_lte: { type: Number, required: true, unique: true },
  kilos: Number,
  numero_cajas: Number,
  precio_kilo_salida: Number,
  fecha: Date
});
const Lote = mongoose.model("Lote", LoteSchema);

/* ============================
   TIPOS
============================ */
const TipoSchema = new mongoose.Schema({
  id_tpo: { type: Number, required: true, unique: true },
  nombre: String
});
const Tipo = mongoose.model("Tipo", TipoSchema);

/* ============================
   ESPECIES
============================ */
const EspecieSchema = new mongoose.Schema({
  id_epe: { type: Number, required: true, unique: true },
  nombre: String,
  id_lte: { type: Number, ref: "Lote", required: true },
  id_tpo: { type: Number, ref: "Tipo", required: true },
  imagen: String
});
const Especie = mongoose.model("Especie", EspecieSchema);

/* ============================
   COMPRAS
============================ */
const CompraSchema = new mongoose.Schema({
  id_cmp: { type: Number, required: true, unique: true },
  codigo_cpr: { type: Number, ref: "Comprador", required: true },
  precio_kilo_final: Number,
  precio_total: Number,
  kilos: Number,
  nombre_especie: String,


  fecha: Date
});
const Compra = mongoose.model("Compra", CompraSchema);

module.exports = { User, Comprador, Lote, Tipo, Especie, Compra };
/* ============================
   EXPORTAR
============================ */
module.exports = { User, Comprador, Lote, Tipo, Especie, Compra };
