const express = require("express");
const router = express.Router();
const { Compra } = require("../models/collections");

// Registrar varias compras (carrito completo)
router.post("/", async (req, res) => {
    try {
        const { codigo_cpr, compras } = req.body;

        if (!codigo_cpr) return res.status(400).json({ error: "Falta codigo_cpr" });
        if (!Array.isArray(compras) || compras.length === 0)
            return res.status(400).json({ error: "No hay productos en el pedido" });

        const guardadas = [];

        for (const c of compras) {
            const compra = new Compra({
                id_cmp: c.id_cmp,
                codigo_cpr,
                precio_kilo_final: c.precio_kilo_final,
                precio_total: c.precio_total,
                
                // --- AQUI GUARDAMOS LO NUEVO ---
                kilos: c.kilos,
                nombre_especie: c.nombre, // Viene del UserPanel como 'nombre'
                // -------------------------------
                
                fecha: new Date()
            });

            const nueva = await compra.save();
            guardadas.push(nueva);
        }

        res.json({ mensaje: "Pedido registrado correctamente", compras: guardadas });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar compra" });
    }
});

// Historial por comprador
router.get("/:codigo", async (req, res) => {
    try {
        const compras = await Compra.find({ codigo_cpr: req.params.codigo });
        res.json(compras);
    } catch (err) {
        res.status(500).json({ error: "Error obteniendo pedidos" });
    }
});

module.exports = router;
