const express = require('express')
const productsRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router')
const viewsRouter = require('./routes/views.router')
const exphbs = require('express-handlebars');
const engine = exphbs.engine;
const Server = require("socket.io").Server;
const path = require('path');


const PORTO = 8080
const app = express()

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './src/views')

app.use('/', viewsRouter);

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).render('home');
});

const server = app.listen(PORTO, () => {
  console.log(`Server online ${PORTO}`)
})


const io = new Server(server)
// io.on("connection",socket=>{
//   console.log(`se conecto un cliente con id ${socket.id}`)

//   socket.emit("hello", {emisor:"Server", mensaje:"Bienvenido...!!!"})

//   socket.on("id", datos=>{
//       console.log(`El socket con id ${socket.id} se ha identificado como ${datos.nombre}`)
//       socket.broadcast.emit("nuevoUsuario",{emisor:'Server', mensaje:`${datos.nombre} se ha unido al servidor`})
//   })

//   socket.on("mensaje",datos=>{
//       io.emit("nuevoMensaje",datos)
//   })

// }) CODIGO ANTERIOR

let usuarios=[]
let mensajes=[]

io.on("connection", socket => {
  console.log(`Se ha conectado un cliente id ${socket.id}`)

  socket.on('id', nombre => {

    usuarios.push({nombre, id:socket.id})
    socket.broadcast.emit('nuevoUsuario', nombre)
    socket.emit("Bienvenido",mensajes)
  })

  socket.on('mensaje', datos => {
    mensajes.push(datos)
    io.emit('nuevoMensaje', datos)
  })

  socket.on("disconnect",()=>{
    let usuario=usuarios.find(u=>u.id===socket.id)
    if(usuario){
        io.emit("usuarioDesconectado", usuario.nombre)
    }
})

})
