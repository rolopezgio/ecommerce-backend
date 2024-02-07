const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/carts.controller');

router.post('/', cartController.createCart);
router.get('/:id', cartController.getCart);
router.post('/:id/products', cartController.addProductToCart);
router.put('/:id', cartController.updateCart);
router.put('/:id/products/:productId', cartController.updateProductQuantity);
router.delete('/:id/products/:productId', cartController.deleteProductFromCart);
router.delete('/:id', cartController.deleteAllProductsFromCart);

module.exports = router;
