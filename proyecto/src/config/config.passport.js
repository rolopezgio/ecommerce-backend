const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { usuariosModelo } = require('../dao/models/usuarios.modelo.js');
const bcrypt = require('bcrypt');

passport.use('registro', new LocalStrategy(
  {
    passReqToCallback: true,
    usernameField: 'email',
  },
  async (req, username, password, done) => {
    try {
      console.log("Estrategia local registro de Passport...!!!");
      let { nombre, email } = req.body;
      if (!nombre || !email || !password) {
        return done(null, false);
      }

      let regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
      console.log(regMail.test(email));
      if (!regMail.test(email)) {
        return done(null, false);
      }

      let existe = await usuariosModelo.findOne({ email });
      if (existe) {
        return done(null, false);
      }

      password = await bcrypt.hash(password, 10);
      console.log(password);
      let usuario;
      try {
        usuario = await usuariosModelo.create({ nombre, email, password });
        return done(null, usuario);
      } catch (error) {
        return done(null, false);
      }

    } catch (error) {
      return done(error);
    }
  }
));

passport.use('login', new LocalStrategy(
  {
    usernameField: 'email',
  },
  async (username, password, done) => {
    try {
      let usuario = await usuariosModelo.findOne({ email: username });
      if (!usuario) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const isValidPassword = await bcrypt.compare(password, usuario.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, usuario);

    } catch (error) {
      return done(error, false);
    }
  }
));

passport.use('github', new GitHubStrategy(
    {
        clientID: "0a7dc3a5256dd26edb03", 
        clientSecret: "e13ecea77180fb813d95ddaf635ee350c346ffbe", 
        callbackURL: "https://github.com/rolopezgio/ecommerce-backend", 
    },
    async(accessToken, refreshToken, profile, done)=>{
        try {
            let usuario=await usuariosModelo.findOne({email: profile._json.email})
            if(!usuario){
                let nuevoUsuario={
                    nombre: profile._json.name,
                    email: profile._json.email, 
                    profile
                }

                usuario=await usuariosModelo.create(nuevoUsuario)
            }
            return done(null, usuario)


        } catch (error) {
            return done(error)
        }
    }
))

passport.serializeUser((usuario, done) => {
  done(null, usuario._id);
});

passport.deserializeUser(async (id, done) => {
  let usuario = await usuariosModelo.findById(id);
  done(null, usuario);
});

module.exports = passport;
