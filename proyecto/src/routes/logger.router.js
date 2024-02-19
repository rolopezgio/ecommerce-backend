const express = require('express');
const router = express.Router();
const logger = require('../logger/loggerProduction.js');

router.get('/loggerTest', (req, res) => {
  try {
    logger.info('Este es un mensaje de información');
    logger.warning('Este es un mensaje de advertencia');
    logger.error('Este es un mensaje de error');
    logger.fatal('Este es un mensaje de fatalidad');
    res.status(200).json({ message: 'Logs generados correctamente' });
  } catch (error) {
    console.error('Error al generar logs:', error);
    res.status(500).json({ error: 'Error al generar logs' });
  }
});

module.exports = router;
