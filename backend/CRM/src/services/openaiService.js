const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * IA CRM con memoria de checklist
 */
async function analizarCliente({ mensaje, checklistPrevio }) {
  try {
    const prompt = `
Eres un asesor inmobiliario experto en CRM inmobiliario.

CHECKLIST ACTUAL DEL CLIENTE:
${JSON.stringify(checklistPrevio || {}, null, 2)}

NUEVO MENSAJE DEL CLIENTE:
"${mensaje}"

INSTRUCCIONES IMPORTANTES:

1. Actualiza el checklist usando la información nueva.
2. NO borres datos ya existentes.
3. NO preguntes algo que ya esté completo.
4. Solo pregunta lo que falte.
5. Si el checklist está completo, genera una respuesta de cierre profesional.
6. Responde SIEMPRE en JSON válido.
7. Si un campo ya tiene valor, consérvalo.

Devuelve EXACTAMENTE este formato:

{
  "checklist": {
    "tipo_propiedad": "",
    "presupuesto": "",
    "ubicacion": "",
    "intencion": "",
    "urgencia": ""
  },
  "faltantes": [],
  "score": 0,
  "categoria": "",
  "siguiente_accion": "",
  "respuesta_bot": ""
}

REGLAS DE SCORE:
- Presupuesto claro = +25
- Ubicación clara = +20
- Intención definida = +20
- Urgencia definida = +15
- Checklist completo = +20

Categoría:
80-100 = Cliente viable
50-79 = Cliente en seguimiento
0-49 = Cliente poco viable

NO escribas texto fuera del JSON.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, 
    });

    const content = response.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error("❌ Error parseando JSON IA:");
      console.error(content);
      throw parseError;
    }

    
    if (!parsed.respuesta_bot || parsed.respuesta_bot.trim() === "") {
      parsed.respuesta_bot =
        "Perfecto, estoy revisando opciones con la información que me compartiste. En un momento te paso detalles.";
    }

    return parsed;

  } catch (error) {
    console.error("❌ Error en analizarCliente:", error);

    
    return {
      checklist: checklistPrevio || {},
      faltantes: [],
      score: 0,
      categoria: "Cliente en seguimiento",
      siguiente_accion: "Revisar manualmente",
      respuesta_bot:
        "Estoy teniendo un pequeño retraso procesando la información. En breve continúo contigo.",
    };
  }
}

module.exports = { analizarCliente };
