const express = require("express");
const router = express.Router();

const { incomingWhatsapp } = require("../controllers/whatsappController");

router.post("/incoming", incomingWhatsapp);

module.exports = router;
