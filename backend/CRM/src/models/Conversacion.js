const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Conversacion = sequelize.define(
  "Conversacion",
  {
    estado_bot: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "Conversaciones",
  }
);

module.exports = Conversacion;
