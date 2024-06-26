const bcrypt = require('bcrypt');
const passport = require('passport');
const { usuariosModelo } = require('../dao/models/usuarios.modelo.js');
const UserDTO = require('../dao/dtos/user.dto.js');


class SessionController {
  async loginUser(req, res, next) {
    passport.authenticate('local-login', {
      successRedirect: '/products',
      failureRedirect: '/login?error=credenciales incorrectas',
    })(req, res, async (err) => {
      if (!err) {
        try {
          const userId = req.user._id;
          await User.findByIdAndUpdate(userId, { last_connection: new Date() });
        } catch (error) {
          console.error('Error al actualizar last_connection:', error);
        }
      }
      next(err);
    });
  }

  async logoutUser(req, res) {
    try {
      const userId = req.user._id;
      await User.findByIdAndUpdate(userId, { last_connection: new Date() });
    } catch (error) {
      console.error('Error al actualizar last_connection:', error);
    }

    req.logout();
    res.redirect('/login');
  }

  async registerUser(req, res) {
    let { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.redirect('/registro?error=Complete todos los datos');
    }

    let regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regMail.test(email)) {
      return res.redirect('/registro?error=Formato de mail incorrecto');
    }

    let existe = await usuariosModelo.findOne({ email });
    if (existe) {
      return res.redirect(`/registro?error=Existen usuarios con email ${email} en la BD`);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      let usuario = await usuariosModelo.create({ nombre, email, password: hashedPassword });

      req.login(usuario, (err) => {
        if (err) {
          return res.redirect('/registro?error=Error inesperado. Reintente en unos minutos');
        }
        res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`);
      });
    } catch (error) {
      res.redirect('/registro?error=Error inesperado. Reintente en unos minutos');
    }
  }

  async authenticateGitHub(req, res) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res);
  }

  async githubCallback(req, res, next) {
    passport.authenticate('github', {
      successRedirect: '/perfil',
      failureRedirect: '/errorGithub',
    })(req, res, next);
  }

  async githubError(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      error: 'Error al autenticar con Github',
    });
  }
  
  async getCurrentUser(req, res) {
    try {
      if (!req.user) {
        this.sendJsonResponse(res, { error: 'Usuario no autenticado.' }, 500);
      }
      const userDTO = new UserDTO(req.user);
      return res.status(200).json(userDTO);
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      return this.sendJsonResponse(res, { error: 'Error al obtener el usuario actual.' }, 500);

    }
  }
  sendJsonResponse(res, data, status = 200) {
    if (res) {
      res.status(status).json(data);
    } else {
      console.error('La variable "res" es indefinida.');
    }
  }
  
  
}

module.exports = new SessionController();