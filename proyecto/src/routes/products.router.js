const ProductManager = require('../managers/ProductManager');
const path = require('path');

const Router = require('express').Router;
const router = Router()

const productManager = new ProductManager(path.join(__dirname, "..", "archivos", "productos.json"))

router.get('/', (req, res) => {
    let limit = req.query.limit
    let productos = productManager.getProducts()
    if (limit) {
        productos = productos.slice(0, limit)
    }
    res.json(productos)
})

router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productos = productManager.getProducts();
    const producto = productos.find(producto => producto.id === productId);
    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
});

router.post('/', (req, res) => {
    let { title, description, price, thumbnail, code, stock, category } = req.body
    console.log("Recibido desde el body:", { title, description, price, thumbnail, code, stock, category })

    if (!title || !description || !price || !category || stock === undefined) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Faltan completar campos' });
    }
    let productos = productManager.getProducts()
    let existe = productos.find(product => product.code === code)
    if (existe) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El código ${code} ya existe en BD` })
    }
    let id = 1
    if (productos.length > 0) {
        id = productos[productos.length - 1].id + 1
    }
    let nuevoProducto = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        id
    }
    productos.push(nuevoProducto)

    res.send(nuevoProducto)

});

router.put('/:id', (req, res) => {
    let { id } = req.params
    id = parseInt(id)

    if (isNaN(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Indique un id numérico' });
    }
    let productos = productManager.getProducts();

    let indiceProducto = productos.findIndex(producto => producto.id === id);

    if (indiceProducto === -1) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen usuarios con id ${id}` })
    }

    let propiedadesPermitidas = ["title", "description", "price", "code", "stock", "category"]
    let propiedadesQueLlegan = Object.keys(req.body)
    let valido = propiedadesQueLlegan.every(propiedad => propiedadesPermitidas.includes(propiedad))
    if (!valido) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No se aceptan algunas propiedades`, propiedadesPermitidas })
    }

    let productoModificado = {
        ...productos[indiceProducto],
        ...req.body,
        id
    }
    productos[indiceProducto] = productoModificado

    res.send(productos)

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        productoModificado
    }); 
});

router.delete('/:id', (req, res) => {
    let { id } = req.params
    id = parseInt(id)
    if (isNaN(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Indique un id numérico` })
    }

    // NO FUNCIONA
//     let productos = productManager.getUsuarios()
//     let indiceProducto = productos.findIndex(producto => producto.id === id)
//     if (indiceProducto ===-1) {
//         res.setHeader('Content-Type', 'application/json');
//         return res.status(400).json({ error: `No existen productos con id ${id}` })
//     }   
    
    // NO FUNCIONA
//     let productoEliminado = productos.splice(indiceProducto, 1)
//     res.send(productos)
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).json({
//         productoEliminado
//     });
});




module.exports = router