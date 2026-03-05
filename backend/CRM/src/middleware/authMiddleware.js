const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "supersecretkey";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

function roleMiddleware(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: "Permiso denegado" });
    }
    next();
  };
}

module.exports = {
  authMiddleware,
  roleMiddleware,
};
