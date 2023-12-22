const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const mongoose = require('mongoose');
const messagesRouter = require('./routes/messages.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const sessionRouter = require ('./routes/session.router')
const exphbs = require('express-handlebars');
const engine = exphbs.engine;
const Server = require('socket.io').Server;
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { usuariosModelo } = require('./dao/models/usuarios.modelo.js');


const PORTO = 8080;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fileStore=FileStore(session)
app.use(session(
  {
      store: new FileStore({
          path:'./src/sessions', ttl: 3600, retries: 0
      }),
      secret: 'coder123',
      resave: true, 
      saveUninitialized: true
      
  }
))
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/products', productsRouter);
app.use('/api/session', sessionRouter)
app.use('/logout', sessionRouter)
app.use('/', viewsRouter);

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await usuariosModelo.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usuariosModelo.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


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