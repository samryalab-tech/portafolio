const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Checklist = sequelize.define("Checklist", {
  data: {
    type: DataTypes.TEXT("long"),
    allowNull: false,

    // ✅ Esto convierte automáticamente JSON ↔ string
    get() {
      const rawValue = this.getDataValue("data");
      return rawValue ? JSON.parse(rawValue) : null;
    },

    set(value) {
      this.setDataValue("data", JSON.stringify(value));
    },
  },
});

module.exports = Checklist;
