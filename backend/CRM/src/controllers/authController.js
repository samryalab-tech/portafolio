const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const SECRET = process.env.JWT_SECRET || "supersecretkey";

async function register(req, res) {
  try {
    const { nombre, email, password, rol } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol,
    });

    res.json({ ok: true, usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const valid = await bcrypt.compare(password, usuario.password);

    if (!valid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
      },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({ ok: true, token, usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en login" });
  }
}

module.exports = {
  register,
  login,
};
