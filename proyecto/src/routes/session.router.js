const { Router } = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { usuariosModelo } = require('../dao/models/usuarios.modelo.js');
const router = Router();

router.post('/login', async (req, res) => {
    let { email, password } = req.body;
  
    if (!email || !password) {
      return res.redirect('/login?error=Complete todos los datos');
    }
  
    try {
      const user = await usuariosModelo.findOne({ email });
  
      if (!user) {
        return res.redirect(`/login?error=credenciales incorrectas`);
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (!isValidPassword) {
        return res.redirect(`/login?error=credenciales incorrectas`);
      }
  
      req.session.usuario = {
        nombre: user.nombre,
        email: user.email,
      };
  
      res.redirect('/perfil');
    } catch (error) {
      res.redirect('/login?error=Error inesperado. Reintente en unos minutos');
    }
  });

router.post('/registro', async (req, res) => {
  let { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.redirect('/registro?error=Complete todos los datos');
  }

  let regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  console.log(regMail.test(email));
  if (!regMail.test(email)) {
    return res.redirect('/registro?error=Mail con formato incorrecto...!!!');
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
  req.session.destroy((error) => {
    if (error) {
      res.redirect('/login?error=fallo en el logout');
    }
  });

  res.redirect('/login');
});

router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/perfil');
  }
);

module.exports = router;
