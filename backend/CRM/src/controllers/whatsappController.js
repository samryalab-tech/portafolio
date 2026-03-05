const Cliente = require("../models/Cliente");
const Conversacion = require("../models/Conversacion");
const Checklist = require("../models/Checklist");
const Mensaje = require("../models/Mensaje");
const { generarChecklist } = require("../services/openaiService");

/**
 * Endpoint que procesa un mensaje entrante de un cliente.
 * 1. Busca o crea al cliente
 * 2. Guarda el mensaje del cliente
 * 3. Crea una conversación si no existe
 * 4. Genera checklist con OpenAI
 * 5. Genera mensaje de respuesta del bot
 * 6. Devuelve resumen completo
 */
async function incomingWhatsapp(req, res) {
  try {
    const { whatsapp_id, mensaje } = req.body;

    if (!whatsapp_id || !mensaje) {
      return res.status(400).json({ error: "Falta el texto del mensaje o whatsapp_id" });
    }

    // 1. Buscar o crear cliente
    let cliente = await Cliente.findOne({ where: { whatsapp_id } });
    if (!cliente) {
      cliente = await Cliente.create({
        whatsapp_id,
        nombre: "Nuevo Cliente",
      });
    }

    // 2. Guardar mensaje del cliente
    const mensajeCliente = await Mensaje.create({
      texto: mensaje,
      enviado_por: "cliente",
      ClienteId: cliente.id,
    });

    // 3. Crear conversación si no existe
    let conversacion = await Conversacion.findOne({ where: { ClienteId: cliente.id } });
    if (!conversacion) {
      conversacion = await Conversacion.create({ ClienteId: cliente.id });
    }

    // 4. Generar checklist con OpenAI
    const checklistAI = await generarChecklist(mensaje);
    const [checklist, created] = await Checklist.findOrCreate({
      where: { ClienteId: cliente.id },
      defaults: { data: checklistAI },
    });

    if (!created) {
      // Si ya existe, actualizarlo
      checklist.data = checklistAI;
      await checklist.save();
    }

    // 5. Generar mensaje de respuesta del bot (ejemplo simple)
    const mensajeBot = await Mensaje.create({
      texto: "Hola! 👋 Gracias por tu mensaje. Te responderemos pronto con detalles sobre tu solicitud.",
      enviado_por: "bot",
      ClienteId: cliente.id,
    });

    // 6. Devolver resumen completo
    res.json({
      ok: true,
      cliente,
      mensajeCliente,
      mensajeBot,
      checklist,
    });
  } catch (error) {
    console.error("Error WhatsApp:", error);
    res.status(500).json({ error: "Error interno" });
  }
}

module.exports = { incomingWhatsapp };
