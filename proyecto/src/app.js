const express = require('express')
const productsRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router')

const PORTO = 8080
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('Bienvenidos a la página de inicio');
  });

const server = app.listen(PORTO, () => {
    console.log(`Server online ${PORTO}`)
})