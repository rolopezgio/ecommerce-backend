const passport = require('passport');
const mongoose = require('mongoose');
const { initPassport } = require('./config/config.passport.js');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
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
const { UserModel } = require('./dao/models/user.model');

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
initPassport();
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

passport.use('local-register', new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
}, async (req, email, password, done) => {
  try {
    const { nombre } = req.body;
    if (!nombre || !email || !password) {
      return done(null, false, { message: 'Todos los campos son obligatorios' });
    }
    const regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regMail.test(email)) {
      return done(null, false, { message: 'Formato de correo electrónico no válido' });
    }
  let existe = await UserModel.findOne({ email });
    if (existe) {
      return done(null, false, { message: 'El correo electrónico ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = {
      nombre,
      email,
      password: hashedPassword,
    };
    const usuario = await UserModel.create(nuevoUsuario);
    return done(null, usuario);
  } catch (error) {
    return done(error);
  }
}));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    const usuario = await UserModel.findOne({ email });
    if (!usuario) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    const isValidPassword = await bcrypt.compare(password, usuario.password);
    if (!isValidPassword) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
    return done(null, usuario);
  } catch (error) {
    return done(error);
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
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