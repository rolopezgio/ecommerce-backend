const fs = require('fs');
const ProductManager = require('../dao/managers/ProductManager');
const path = require('path');
const mongoose = require('mongoose');
const { productsModelo } = require('../dao/models/products.model');

const Router = require('express').Router;
const router = Router()


const productManager = new ProductManager(path.join(__dirname, "..", "archivos", "productos.json"))

router.get('/', async (req, res) => {
    try {
      let { limit = 10, page = 1, query = '', sort, category, availability } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);
  
      const skip = (page - 1) * limit;
  
      let productos = [];
  
      const sortOptions = {};
      if (sort) {
        const order = sort.startsWith('-') ? -1 : 1;
        const field = sort.replace(/^-/, '');
        sortOptions[field] = order;
      }
  
      const searchOptions = {};
      if (query) {
        searchOptions.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { price: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ];
      }
  
      if (category) {
        searchOptions.category = category;
      }
  
      if (availability !== undefined) {
        searchOptions.stock = availability === 'true' ? { $gt: 0 } : 0;
      }
  
      productos = await productsModelo
        .find(searchOptions)
        .limit(limit)
        .skip(skip)
        .sort(sortOptions);
  
      const totalProductos = await productsModelo.countDocuments(searchOptions);
      const totalPages = Math.ceil(totalProductos / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
      const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;
  
      res.status(200).json({
        status: 'success',
        payload: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ status: 'error', error: 'Error al obtener productos.' });
    }
  });

  router.get('/:id',async(req,res)=>{
    let {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
    }

    let existe
    try {
        existe=await productsModelo.findOne() 
        console.log(existe)
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
    }

    if(!existe){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`No existen productos con id ${id}`})
    }

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({producto:existe});
})


  router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body;
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
    const nuevoProducto = new productsModelo({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
      });
      await nuevoProducto.save();
      res.json(nuevoProducto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.put('/:id',async(req,res)=>{
    let {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese id válido`})
    }

    let existe
    try {
        existe=await productsModelo.findOne() 
        console.log(existe)
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde`, detalle: error.message})
    }

    if(!existe){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`No existen productos con id ${id}`})
    }

    if(req.body._id){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`No se pueden modificar la propiedades "_id"`})
    }

    let resultado
    try {
        resultado=await productsModelo.updateOne(req.body)
        console.log(resultado)
        if(resultado.modifiedCount>0){
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload:"Modificacion realizada"});
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No se concretó la modificación`})
        }
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde`, detalle: error.message})
    }
})

router.delete('/:id',async(req,res)=>{
  let {id}=req.params
  if(!mongoose.Types.ObjectId.isValid(id)){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`Ingrese un id válido`})
  }

  let existe
  try {
      existe=await productsModelo.findOne() 
      console.log(existe)
  } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde`, detalle: error.message})
  }

  if(!existe){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existen productos con id ${id}`})
  }

  let resultado
  try {
      resultado=await productsModelo.updateOne()
      console.log(resultado)
      if(resultado.deletedCount>0){
          res.setHeader('Content-Type','application/json');
          return res.status(200).json({payload:"Eliminacion realizada"});
      }else{
          res.setHeader('Content-Type','application/json');
          return res.status(400).json({error:`No se concretó la eliminacion`})
      }
  } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde`, detalle: error.message})
  }
});

module.exports = router