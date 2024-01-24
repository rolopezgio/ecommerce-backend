const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/carts.controller');

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCart);
router.post('/:id/products/:productId', cartController.addProductToCart);
router.put('/:cid', cartController.updateCart);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);
router.delete('/:cid', cartController.deleteAllProductsFromCart);

module.exports = router;
