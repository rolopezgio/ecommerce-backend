const CartsManager = require('../managers/CartsManager');
const path = require('path');
const express = require('express');
const router = express.Router();

const cartsManager = new CartsManager(path.join(__dirname, '..', 'archivos', 'carts.json'));

router.post('/', (req, res) => {
  const newCart = {
    id: Math.floor(Math.random() * 1000), // ID aleatorio
    products: [],
  };

  cartsManager.addCart(newCart);
  res.status(201).json(newCart);
});

router.get('/:id', (req, res) => {
  const cartId = parseInt(req.params.id);
  const carts = cartsManager.getCarts();

  const cart = carts.find((cart) => cart.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart.products);
});

router.post('/:id/products/:productId', (req, res) => {
  const cartId = parseInt(req.params.id);
  const productId = parseInt(req.params.productId);
  const quantity = parseInt(req.body.quantity);

  if (isNaN(cartId) || isNaN(productId) || isNaN(quantity)) {
    return res.status(400).json({ error: 'Los parámetros deben ser numéricos' });
  }

  const success = cartsManager.addProductToCart(cartId, productId, quantity);

  if (!success) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const carts = cartsManager.getCarts();
  const cart = carts.find((cart) => cart.id === cartId);

  res.status(201).json(cart);
});

module.exports = router;
