const Cliente = require("../models/Cliente");
const Mensaje = require("../models/Mensaje");
const Checklist = require("../models/Checklist");

const { generarChecklist } = require("../services/openaiService");

async function enviarMensajeCliente(req, res) {
  try {
    const { id } = req.params;
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ error: "Falta el texto del mensaje" });
    }

    // 1. Verificar cliente
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // 2. Guardar mensaje del cliente
    const mensajeCliente = await Mensaje.create({
      texto,
      enviado_por: "cliente",
      ClienteId: cliente.id,
    });

    // 3. Generar checklist actualizado con OpenAI
    const checklistAI = await generarChecklist(texto);

    // 4. Guardar checklist (nuevo o actualizar último)
    let checklist = await Checklist.findOne({
      where: { ClienteId: cliente.id },
      order: [["createdAt", "DESC"]],
    });

    if (!checklist) {
      checklist = await Checklist.create({
        ClienteId: cliente.id,
        data: checklistAI,
      });
    } else {
      checklist.data = checklistAI;
      await checklist.save();
    }

    // 5. Generar respuesta simple del bot (por ahora)
    const respuestaBot = `Perfecto 👌 ya entendí. Estoy analizando tu solicitud.`;

    // 6. Guardar mensaje del bot
    const mensajeBot = await Mensaje.create({
      texto: respuestaBot,
      enviado_por: "bot",
      ClienteId: cliente.id,
    });

    // 7. Respuesta final
    res.json({
      ok: true,
      cliente,
      mensajeCliente,
      mensajeBot,
      checklist,
    });
  } catch (error) {
    console.error("Error mensaje:", error);
    res.status(500).json({ error: "Error interno" });
  }
}

module.exports = { enviarMensajeCliente };
