const express = require('express');
const router = express.Router();
const { messagesModelo } = require('../dao/models/messages.model');

router.get('/', async (req, res) => {
    try {
      const mensajes = await messagesModelo.find();
      res.status(200).json(mensajes);
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      res.status(500).json({ error: 'Error al obtener mensajes.' });
    }
  });


router.post('/', async (req, res) => {
  try {
    const { user, message } = req.body;
    const nuevoMensaje = new messagesModelo({ user, message });
    await nuevoMensaje.save();
    res.status(201).json({ mensaje: 'Mensaje guardado exitosamente.' });
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    res.status(500).json({ error: 'Error al guardar el mensaje.' });
  }
});

module.exports = router;