const Cliente = require("../models/Cliente");
const Mensaje = require("../models/Mensaje");
const Checklist = require("../models/Checklist");
const { analizarCliente } = require("../services/openaiService");


/**
 * POST /api/clientes/mensaje
 * Recibe mensaje del cliente, crea cliente si no existe,
 * guarda mensaje, genera respuesta del bot y checklist.
 */
async function incomingMensaje(req, res) {
  try {
    const { whatsapp_id, mensaje } = req.body;

    if (!whatsapp_id || !mensaje) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // 1. Buscar o crear cliente
    let cliente = await Cliente.findOne({ where: { whatsapp_id } });
    if (!cliente) {
      cliente = await Cliente.create({
        whatsapp_id,
        nombre: "Nuevo Cliente",
        presupuesto: null,
        zona: null,
        AsesorId: null,
      });
    }

    // 2. Guardar mensaje del cliente
    const mensajeCliente = await Mensaje.create({
      texto: mensaje,
      enviado_por: "cliente",
      ClienteId: cliente.id,
    });

    // 3. Generar mensaje del bot y checklist
    let textoBot = "Hola! 😊 Gracias por tu mensaje. Lo estoy procesando.";
    let checklistData = null;

    try {
      // 🔎 Buscar checklist previo
      const checklistPrevioDB = await Checklist.findOne({
        where: { ClienteId: cliente.id },
        order: [["createdAt", "DESC"]],
      });

      let checklistPrevio = null;

      if (checklistPrevioDB) {
        checklistPrevio = checklistPrevioDB.data;
      }

      // ✅ Llamar IA con memoria
      const resultadoAI = await analizarCliente({
        mensaje,
        checklistPrevio,
      });

      if (resultadoAI && resultadoAI.checklist) {
        const checklistAI = resultadoAI.checklist;

        // 🔄 Si ya existe checklist → actualizar
        if (checklistPrevioDB) {
          await checklistPrevioDB.update({
            data: resultadoAI,
          });
          checklistData = checklistPrevioDB;
        } else {
          checklistData = await Checklist.create({
            ClienteId: cliente.id,
            data: resultadoAI,
          });
        }

        // ✅ Extraer campos
        const {
          tipo_propiedad,
          presupuesto,
          ubicacion,
          intencion,
          urgencia,
        } = checklistAI;

        const { score, categoria, siguiente_accion, respuesta_bot } = resultadoAI;

        // ✅ Actualizar cliente
        await cliente.update({
          tipo_propiedad: tipo_propiedad || cliente.tipo_propiedad,
          presupuesto: presupuesto || cliente.presupuesto,
          zona: ubicacion || cliente.zona,
          intencion: intencion || cliente.intencion,
          urgencia: urgencia || cliente.urgencia,
          score,
          categoria,
          siguiente_accion,
        });

        textoBot = respuesta_bot;
      }
    } catch (err) {
      console.error("Error generando checklist:", err);
    }


    // 4. Crear mensaje del bot
    const mensajeBot = await Mensaje.create({
      texto: textoBot,
      enviado_por: "bot",
      ClienteId: cliente.id,
    });

    // 5. Respuesta final API
    res.json({
      ok: true,
      cliente,
      mensajeCliente,
      mensajeBot,
      checklist: checklistData,
    });
  } catch (error) {
    console.error("Error incomingMensaje:", error);
    res.status(500).json({ error: "Error interno" });
  }
}

/**
 * GET /api/clientes/:id/resumen
 * Devuelve cliente, mensajes y checklist
 */
async function obtenerResumenCliente(req, res) {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const mensajes = await Mensaje.findAll({
      where: { ClienteId: id },
      order: [["createdAt", "ASC"]],
    });

    const checklist = await Checklist.findOne({
      where: { ClienteId: id },
    });

    res.json({
      ok: true,
      cliente,
      mensajes,
      checklist,
    });
  } catch (error) {
    console.error("Error obtenerResumenCliente:", error);
    res.status(500).json({ error: "Error interno" });
  }
}

/**
 * GET /api/clientes
 * Devuelve lista de clientes (para React)
 */
async function listarClientes(req, res) {
  try {
    const clientes = await Cliente.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      ok: true,
      clientes,
    });
  } catch (error) {
    console.error("Error listarClientes:", error);
    res.status(500).json({ error: "Error interno" });
  }
}

module.exports = {
  incomingMensaje,
  obtenerResumenCliente,
  listarClientes,
};
