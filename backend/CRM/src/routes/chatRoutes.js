const express = require('express');
const router = express.Router();
const { receiveMessage } = require('../controllers/chatController');

router.post('/incoming', receiveMessage);

module.exports = router; // ✅ Debe exportar directamente el router
