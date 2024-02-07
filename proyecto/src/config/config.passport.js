const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { usuariosModelo } = require('../dao/models/usuarios.modelo.js');
const bcrypt = require('bcrypt');

passport.use('local-register', new LocalStrategy(
  {
    passReqToCallback: true,
    usernameField: 'email',
  },
  async (req, email, password, done) => {
    try {
      const { first_name, last_name, age } = req.body;

      const existingUser = await usuariosModelo.findOne({ email });
      if (existingUser) {
        return done(null, false, { message: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await usuariosModelo.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
      });

      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use('local-login', new LocalStrategy(
  {
    usernameField: 'email',
  },
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
      return done(null, user, { successRedirect: '/perfil' });
    } catch (error) {
      return done(error);
    }
  }
));


const initPassport = () => {
  passport.use('github', new GitHubStrategy(
    {
      clientID: "Iv1.2c52be52ca5f6d2a", 
      clientSecret: "8f19f3783ebc4172bfa5e7bf0093892af49e8f15", 
      callbackURL: "http://localhost:8080/api/session/callbackGithub", 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await usuariosModelo.findOne({ email: profile._json.email });
        if (!user) {
          let newUser = {
            first_name: profile._json.name,
            email: profile._json.email, 
            profile,
          };
          user = await usuariosModelo.create(newUser);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
};

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usuariosModelo.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

module.exports = { passport, initPassport };