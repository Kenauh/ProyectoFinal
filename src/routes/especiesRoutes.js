const express = require("express");
const router = express.Router();
const { Especie, Lote, Tipo } = require("../models/collections");

// Devuelve especies con lote y tipo incluidos
router.get("/", async (req, res) => {
    try {
        const especies = await Especie.find();
        const resultado = [];

        for (const e of especies) {
            const lote = await Lote.findOne({ id_lte: e.id_lte });
            const tipo = await Tipo.findOne({ id_tpo: e.id_tpo });

            resultado.push({
                ...e._doc,
                id_lte: lote,
                id_tpo: tipo
            });
        }

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Error cargando especies" });
    }
});

module.exports = router;
