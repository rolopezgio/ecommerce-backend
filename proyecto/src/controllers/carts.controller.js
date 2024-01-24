const { cartsModelo } = require('../dao/models/carts.model');

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartsModelo.create({ products: [] });
      res.status(201).json(newCart);
    } catch (error) {
      console.error('Error al crear un nuevo carrito:', error);
      res.status(500).json({ error: 'Error al crear un nuevo carrito.' });
    }
  }

  async getCart(req, res) {
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
  }

  async addProductToCart(req, res) {
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
  }

  async updateCart(req, res) {
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
  }

  async updateProductQuantity(req, res) {
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
  }

  async deleteProductFromCart(req, res) {
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
  }

  async deleteAllProductsFromCart(req, res) {
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
  }
}

module.exports = new CartController();