const express = require('express');
const router = express.Router();
const { getChecklist, updateChecklist } = require('../controllers/checklistController');

router.get('/:clienteId', getChecklist);
router.put('/:clienteId', updateChecklist);

module.exports = router; // ✅ Export directo
