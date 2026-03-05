const http = require("http");
const app = require("./app");
const sequelize = require("./config/db");

// 🔹 Importar todos los modelos para que sequelize los registre
require("./models"); 

const PORT = process.env.PORT || 5001;

sequelize.sync({ alter: true }) // asegura que las tablas se creen/actualicen
  .then(() => {
    console.log("MySQL conectado y tablas listas");

    const server = http.createServer(app);

    server.listen(PORT, () =>
      console.log(`Backend corriendo en puerto ${PORT}`)
    );
  })
  .catch((err) => console.error("Error conectando MySQL:", err));