const mongoose = require('mongoose');

const productsColeccion = 'products';
const productsEsquema = new mongoose.Schema(
    {
        title: String, 
        description: String, 
        price: Number, 
        code: Number, 
        stock: Number, 
        category: String,
    }
); 

const productsModelo = mongoose.model(productsColeccion, productsEsquema);

module.exports = { productsModelo };
