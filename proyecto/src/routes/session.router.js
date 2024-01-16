const { Router } = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { usuariosModelo } = require('../dao/models/usuarios.modelo.js');
const router = Router();

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/perfil',
  failureRedirect: '/login?error=credenciales incorrectas',
}));

router.post('/registro', async (req, res) => {
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
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/callbackGithub', passport.authenticate('github', {
  successRedirect: '/perfil',
  failureRedirect: '/errorGithub',
}));

router.get('/errorGithub', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    error: 'Error al autenticar con Github',
  });
});

const auth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  next();
};

router.get('/current', auth, (req, res) => {
  const { nombre, email } = req.user;
  res.json({ nombre, email });
});

module.exports = router;


module.exports = router;
