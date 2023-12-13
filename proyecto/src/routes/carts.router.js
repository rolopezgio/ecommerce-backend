const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { cartsModelo } = require('../dao/models/carts.model');

router.post('/', async (req, res) => {
  try {
    const newCart = await cartsModelo.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al crear un nuevo carrito:', error);
    res.status(500).json({ error: 'Error al crear un nuevo carrito.' });
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

router.post('/:id/products/:productId', async (req, res) => {
  const cartId = parseInt(req.params.id);
  const productId = parseInt(req.params.productId);
  const quantity = parseInt(req.body.quantity);

  try {
    const cart = await cartsModelo.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const product = {
      _id: productId,
      quantity: quantity,
    };

    cart.products.push(product);
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito.' });
  }
});

router.put('/:cid', async (req, res) => { //Actualizar carrito con arreglo
  const cartId = req.params.cid;
  const products = req.body.products;

  try {
    const cart = await cartsModelo.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    cart.products = products;
    await cart.save();

    res.json({
      status: 'success',
      payload: 'Carrito actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar el carrito:', error);
    res.status(500).json({ error: 'Error al actualizar el carrito.' });
  }
});

router.put('/:cid/products/:pid', async (req, res) => { //Actualizar cantidad de 1 producto
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    const cart = await cartsModelo.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(product => product.toString() === productId);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();

      res.json({
        status: 'success',
        payload: 'Cantidad de ejemplares actualizada exitosamente',
      });
    } else {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    console.error('Error al actualizar la cantidad de ejemplares:', error);
    res.status(500).json({ error: 'Error al actualizar la cantidad de ejemplares.' });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => { //Eliminar prod específ
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const cart = await cartsModelo.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
 cart.products = cart.products.filter(product => product.toString() !== productId);
 await cart.save();

 res.json({
   status: 'success',
   payload: 'Producto eliminado del carrito exitosamente',
 });
} catch (error) {
 console.error('Error al eliminar el producto del carrito:', error);
 res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
}
});

router.delete('/:cid', async (req, res) => { //Eliminar todos los productos
  const cartId = req.params.cid;

  try {
    const cart = await cartsModelo.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    cart.products = [];
    await cart.save();

    res.json({
      status: 'success',
      payload: 'Productos eliminados del carrito exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar todos los productos del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar todos los productos del carrito.' });
  }
});

module.exports = router;
