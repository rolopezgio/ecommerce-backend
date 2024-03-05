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
        owner: {
            type: String,
            default: 'admin',
            required: true
        }
    }
); 

const productsModelo = mongoose.model(productsColeccion, productsEsquema);

module.exports = { productsModelo };
