const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class CompraController {
  async confirmarCompra(req, res) {
    try {
      const cartId = req.user.cart;
      const cart = await cartsModelo.findById(cartId).populate('products');
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }      
            
      let ticketHTML = `
      <h1>Ticket de Compra</h1>
      <p>Productos:</p>
      <ul>
    `;

    let total = 0;
    for (const item of cart.products) {
      const product = await productsModelo.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Producto con ID ${item.product} no encontrado` });
      }
      ticketHTML += `<li>${product.title} - ${item.quantity} x ${product.price}</li>`;
      total += item.quantity * product.price;
    }

    ticketHTML += `
      </ul>
      <p>Total: $${total}</p>
    `;
      const msg = {
        to: req.user.email,
        from: 'noreply@tudominio.com',
        subject: 'Confirmación de compra',
        html: `
          <p>¡Gracias por tu compra!</p>
          <p>Aquí está tu ticket de compra:</p>
          <p>Detalles de la compra:</p>
          <!-- Aquí puedes incluir detalles específicos de la compra, como productos, precios, etc. -->
        `,
      };

      await sgMail.send(msg);

      res.status(200).json({ message: 'Compra confirmada exitosamente. Se ha enviado un correo electrónico de confirmación.' });
    } catch (error) {
      console.error('Error al confirmar la compra:', error);
      res.status(500).json({ error: 'Error al confirmar la compra.' });
    }
  }
}

module.exports = new CompraController();
