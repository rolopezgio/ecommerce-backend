const fs = require('fs');
const ProductManager = require('../dao/managers/ProductManager');
const path = require('path');
const mongoose = require('mongoose');
const { productsModelo } = require('../dao/models/products.model');

const Router = require('express').Router;
const router = Router()


const productManager = new ProductManager(path.join(__dirname, "..", "archivos", "productos.json"))

router.get('/', async (req, res) => {
  let productos=[]
    try {
      productos = await productsModelo.find();
    } catch (error) {
      console.log(error.message)        
    }
    res.status(200).json({
      productos
  })
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