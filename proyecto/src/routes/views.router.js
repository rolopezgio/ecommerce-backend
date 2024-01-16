const ProductManager = require('../dao/managers/ProductManager');
const express = require('express');
const router = express.Router();
const { UserModel } = require('../dao/models/usuarios.modelo');
const bcrypt = require('bcrypt');


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

  router.get('/registro', (req, res) => {
    let { error } = req.query;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('registro', { error });
  });

  router.post('/registro', async (req, res) => {
    let { first_name, last_name, email, password, age } = req.body;
  
    if (!first_name || !last_name || !email || !password || !age) {
      return res.redirect('/registro?error=Complete todos los datos');
    }
  
    let regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(regMail.test(email));
    if (!regMail.test(email)) {
      return res.redirect('/registro?error=Mail con formato incorrecto...!!!');
    }
  
    let existe = await UserModel.findOne({ email });
    if (existe) {
      return res.redirect(`/registro?error=Existen usuarios con email ${email} en la BD`);
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      let usuario = await UserModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        age
      });
  
      req.login(usuario, (err) => {
        if (err) {
          return res.redirect('/registro?error=Error inesperado. Reintente en unos minutos');
        }
        res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`);
      });
    } catch (error) {
      res.redirect('/registro?error=Error inesperado. Reintente en unos minutos');
    }
  });


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
