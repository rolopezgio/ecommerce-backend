const mongoose = require('mongoose');

const cartsColeccion='carts'
const cartsEsquema=new mongoose.Schema(
    {
        title: String,
        description: String, 
        price: Number, 
        code: Number, 
        stock: Number, 
        category: String,
    }
)

const cartsModelo = mongoose.model(cartsColeccion, cartsEsquema);

module.exports = { cartsModelo };