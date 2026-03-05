const express = require('express');
const router = express.Router();
const { listarAsesores, asignarAsesor } = require('../controllers/asesorController');

router.get('/', listarAsesores);
router.post('/asignar', asignarAsesor);

module.exports = router; // ✅ Export directo
