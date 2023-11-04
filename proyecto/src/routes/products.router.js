const ProductManager = require ('../managers/ProductManager');
const path=require('path');

const Router=require('express').Router;
const router=Router()

const productManager=new ProductManager(path.join(__dirname,"..","archivos","productos.json"))

router.get('/', (req, res) => {
    let limit = req.query.limit
    let productos = productManager.getProducts()
    if (limit) {
        productos=productos.slice(0, limit)
    }
    res.json(productos)
})

router.post('/', (req,res)=>{
  let {title, description, price, thumbnail, code, stock}=req.body
  console.log("Recibido desde el body:",{title, description, price, thumbnail, code, stock})

  // validar lo obligatorio

  // validar que no se repita el CODE
  let productos = productManager.getProducts()  

  let existe = productos.find(product => product.code === code)

  if (!title || !description || !price || !thumbnail || stock === undefined) {
      console.log('Faltan rellenar campos');
      return;
  }

  if (existe) {
      console.log(`El código ${code} ya existe.`)
      return
  }

  // generar el ID para el nuevo elemento

  let id = 1
  if (productos.length > 0) {
      id = productos[productos.length - 1].id + 1
  }  

  // adecuar la respuesta
  res.send('alta productos... completar...!!!')

}) 

// router.get('/api/products/:pid', (req, res) => {
//     const productId = parseInt(req.params.pid);
//     const productos = productManager.getProducts();
//     const producto = productos.find(producto => producto.id === productId);
  
//     if (!producto) {
//       return res.status(404).json({ mensaje: 'Producto no encontrado' });
//     }  
//     res.json(producto);
//   });
  
module.exports=router