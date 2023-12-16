const express = require('express');
const mongoose = require('mongoose');
const messagesRouter = require('./routes/messages.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const exphbs = require('express-handlebars');
const engine = exphbs.engine;
const Server = require('socket.io').Server;
const path = require('path');

const PORTO = 8080;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/messages', messagesRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/views', viewsRouter);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/', viewsRouter);

const server = app.listen(PORTO, () => {
  console.log(`Server online ${PORTO}`);
});

const io = new Server(server);

let usuarios = [];
let mensajes = [];

io.on('connection', (socket) => {
  console.log(`Se ha conectado un cliente id ${socket.id}`);

  socket.on('id', (nombre) => {
    usuarios.push({ nombre, id: socket.id });
    socket.broadcast.emit('nuevoUsuario', nombre);
    socket.emit('Bienvenido', mensajes);
  });

  socket.on('mensaje', (datos) => {
    mensajes.push(datos);
    io.emit('nuevoMensaje', datos);
  });

  socket.on('disconnect', () => {
    let usuario = usuarios.find((u) => u.id === socket.id);
    if (usuario) {
      io.emit('usuarioDesconectado', usuario.nombre);
    }
  });
});

const connectToDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://rolopezgio:coder.coder@cluster0.s4105lc.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce'
    );
    console.log('Base de datos online');
  } catch (error) {
    console.error('Error en la conexión a la base de datos:', error.message);
  }
};
connectToDB();
