const express = require("express");
const router = express.Router();

const { enviarMensajeCliente } = require("../controllers/mensajeController");

// POST enviar mensaje cliente
router.post("/:id/mensaje", enviarMensajeCliente);

module.exports = router;
