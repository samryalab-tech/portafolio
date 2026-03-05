const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Mensaje = sequelize.define("Mensaje", {
  texto: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  enviado_por: {
    type: DataTypes.ENUM("cliente", "asesor", "bot"),
    allowNull: false,
  },
});

module.exports = Mensaje;
