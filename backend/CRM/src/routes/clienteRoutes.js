const express = require("express");
const router = express.Router();

const {
  incomingMensaje,
  obtenerResumenCliente,
  listarClientes // ✅ NUEVO
} = require("../controllers/clienteController");

// POST mensaje del cliente
router.post("/mensaje", incomingMensaje);

// GET lista de clientes (para React)
router.get("/", listarClientes); // ✅ NUEVO

// GET resumen cliente
router.get("/:id/resumen", obtenerResumenCliente);

module.exports = router;
