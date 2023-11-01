const express = require('express')
const ProductManager = require('./ProductManager')

const productManager = new ProductManager('./src/archivos/productos.json')
const PORTO = 3000
const app = express()

app.get('/products', (req, res) => {

    let limit = req.query.limit

    let productos = productManager.getProducts()

    if (limit) {

        productos=productos.slice(0, limit)

    }
    res.json(productos)
})

const server = app.listen(PORTO, () => {
    console.log(`Server online ${PORTO}`)
})