const ProductManager = require('../dao/managers/ProductManager');
const express = require('express');
const router = express.Router();

const productManager = new ProductManager('./src/archivos/productos.json');

const auth=(req,res,next)=>{
  if(!req.session.usuario){
    return res.redirect('/login')
  }
  next()
}

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

  router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
  
    try {
      const cart = await cartsModelo.findById(cartId).populate('products').lean();
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      res.render('carts', { cart });
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      res.status(500).json({ error: 'Error al obtener el carrito.' });
    }
  });

  router.get('/registro',(req,res)=>{
    let {error}=req.query
    res.setHeader('Content-Type','text/html')
    res.status(200).render('registro', {error})
})

router.get('/login',(req,res)=>{
    let {error, mensaje}=req.query
    res.setHeader('Content-Type','text/html')
    res.status(200).render('login', {error, mensaje})
})

router.get('/perfil', auth, (req,res)=>{
    let usuario=req.session.usuario
    res.setHeader('Content-Type','text/html')
    res.status(200).render('perfil', {usuario})
})  

module.exports = router;
