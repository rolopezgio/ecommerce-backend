const fs = require('fs');

class CartsManager {
  constructor(rutaDeArchivos) {
    this.path = rutaDeArchivos;
  }

  getCarts() {
    if (fs.existsSync(this.path)) {
      return JSON.parse(fs.readFileSync(this.path, 'utf-8'));
    } else {
      return [];
    }
  }

  addCart(newCart) {
    const carts = this.getCarts();
    carts.push(newCart);
    fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
  }

  addProductToCart(cartId, productId) {
    const carts = this.getCarts();
    const cart = carts.find((cart) => cart.id === cartId);
  
    if (!cart) {
      return false;
    }
  
    const existingProduct = cart.products.find((product) => product.id === productId);  
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ id: productId, quantity: 1 });
    }
  
    fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
  
    return true;
  }
  
}

module.exports = CartsManager;
