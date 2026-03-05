const Cliente = require("./Cliente");
const Asesor = require("./Asesor");
const Conversacion = require("./Conversacion");
const Mensaje = require("./Mensaje");
const Checklist = require("./Checklist");

/* Relaciones */

Cliente.hasOne(Checklist);
Checklist.belongsTo(Cliente);

Cliente.hasMany(Mensaje);
Mensaje.belongsTo(Cliente);

Asesor.hasMany(Cliente);
Cliente.belongsTo(Asesor);

Cliente.hasOne(Conversacion);
Conversacion.belongsTo(Cliente);

module.exports = {
  Cliente,
  Asesor,
  Mensaje,
  Checklist,
  Conversacion,
};
