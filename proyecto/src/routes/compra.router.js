const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compra.controller');

router.post('/confirmar', compraController.confirmarCompra);

module.exports = router;
