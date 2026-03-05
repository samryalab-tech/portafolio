const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/erp/orderController');

router.get('/billable', orderController.getBillableOrders);
router.post('/', orderController.createOrder);

module.exports = router;