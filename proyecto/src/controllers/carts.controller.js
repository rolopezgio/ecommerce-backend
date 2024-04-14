const { cartsModelo } = require('../dao/models/carts.model');
const { productsModelo } = require('../dao/models/products.model');

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crea un nuevo carrito.
 *     description: Crea un nuevo carrito vacío.
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente.
 *       500:
 *         description: Error al crear un nuevo carrito.
 */

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
    const cartId = req.params.id;
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

  async purchaseCart(cartId) {
    try {
      const cart = await cartsModelo.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      for (const item of cart.products) {
        const product = await productsModelo.findById(item.product);
        if (!product) {
          throw new Error(`Producto con ID ${item.product} no encontrado`);
        }
  
        if (product.stock < item.quantity) {
          throw new Error(`No hay suficiente stock disponible para el producto ${product.title}`);
        }
  
        product.stock -= item.quantity;
        await product.save();
      }
  
      cart.isPurchased = true;
      await cart.save();
  
      return cart;
    } catch (error) {
      console.error('Error al finalizar la compra del carrito:', error);
      throw new Error('Error al finalizar la compra del carrito');
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
  
      const existingProductIndex = cart.products.findIndex(product => product._id === productId);
      if (existingProductIndex !== -1) {
        return res.status(400).json({ error: 'El producto ya pertenece al carrito' });
      }
  
      const product = await productsModelo.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      const newProduct = {
        _id: productId,
        quantity: quantity,
      };
      cart.products.push(newProduct);
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
  
  async confirmPurchase(req, res) {
    const cartId = req.params.id;
    try {
      const cart = await cartsModelo.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
            
      cart.isPurchased = true;
      await cart.save();
      
      res.json({ message: 'Compra confirmada exitosamente' });
    } catch (error) {
      console.error('Error al confirmar la compra del carrito:', error);
      res.status(500).json({ error: 'Error al confirmar la compra del carrito.' });
    }
}
}

module.exports = new CartController();