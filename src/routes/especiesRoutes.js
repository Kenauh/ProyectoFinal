const express = require("express");
const router = express.Router();
const { Especie, Lote, Tipo } = require("../models/collections");

// Obtener especies con sus lotes y tipos
router.get("/", async (req, res) => {
    try {
        const especies = await Especie.find();

        const resultado = [];

        for (let esp of especies) {
            const lote = await Lote.findOne({ id_lte: esp.id_lte });
            const tipo = await Tipo.findOne({ id_tpo: esp.id_tpo });

            resultado.push({
                ...esp._doc,
                id_lte: lote || null,
                id_tpo: tipo || null
            });
        }

        res.json(resultado);

    } catch (error) {
        console.error("ERROR en /api/especies:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
