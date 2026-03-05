const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cliente = sequelize.define("Cliente", {
  whatsapp_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  presupuesto: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  zona: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // ✅ NUEVO CRM
  tipo_propiedad: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  intencion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  urgencia: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },

  categoria: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  siguiente_accion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Cliente;
