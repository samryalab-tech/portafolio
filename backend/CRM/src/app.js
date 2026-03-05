const express = require("express");
const cors = require("cors");

// 🔹 Rutas
const authRoutes = require("./routes/authRoutes");
const clienteRoutes = require("./routes/clienteRoutes"); // tu chat/CRM
// si tienes otras rutas, agrégalas aquí

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json()); // importante para leer req.body
app.use(express.urlencoded({ extended: true })); // por si envías forms

// 🔹 Rutas
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clienteRoutes);

// 🔹 Ruta de prueba
app.get("/", (req, res) => {
  res.send("API CRM funcionando correctamente");
});

module.exports = app;
