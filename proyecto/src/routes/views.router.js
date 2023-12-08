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

router.get('/products', (req, res) => {
    try {
      const productos = productManager.getProducts();
      res.render('productList', { productos });
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).send('Error al obtener los productos.');
    }
  });

  router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
  
    try {
      const cart = await cartsModelo.findById(cartId).populate('products');
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      res.render('cart', { cart });
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      res.status(500).json({ error: 'Error al obtener el carrito.' });
    }
  });

module.exports = router;
