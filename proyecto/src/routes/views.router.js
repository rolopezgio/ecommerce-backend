const ProductManager = require('../managers/ProductManager');
const express = require('express');
const router = express.Router();

const productManager = new ProductManager('./src/archivos/productos.json');

router.get('/', (req, res) => {
    const productos = productManager.getProducts();
    res.render('home', { productos });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;
