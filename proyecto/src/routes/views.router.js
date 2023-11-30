const ProductManager = require('../dao/managers/ProductManager');
const express = require('express');
const router = express.Router();

const productManager = new ProductManager('./src/archivos/productos.json');

router.get('/', (req, res) => {
    const productos = productManager.getProducts();
    res.render('home', { productos });
});

router.get('/realtimeproducts', (req, res) => {
    const productos = productManager.getProducts();

    res.render('realTimeProducts', { productos });
});

router.get('/chat', (req, res) => {

    res.status(200).render('chat');
});

module.exports = router;
