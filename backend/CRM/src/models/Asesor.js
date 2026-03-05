const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Asesor = sequelize.define(
  "Asesor",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "Asesores",
  }
);

module.exports = Asesor;
