const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ecommerce',
        version: '1.0.0',
        description: 'Indumentaria',
      },
    },
    apis: ['./routes/*.js'],
  };
  
const specs = swaggerJsdoc(options);

module.exports = function (app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  };
  
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos los usuarios.
 *     description: Retorna una lista de todos los usuarios registrados.
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *       500:
 *         description: Error interno del servidor.
 */
