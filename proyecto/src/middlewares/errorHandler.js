const errorDictionary = {
    400: 'Petición incorrecta',
    401: 'No autorizado',
    403: 'Acceso prohibido',
    404: 'Recurso no encontrado',
    500: 'Error interno del servidor',
  };
  
  const errorHandler = (err, req, res, next) => {
    let statusCode = err.status || 500;
    let message = errorDictionary[statusCode] || 'Error desconocido';
  
    res.status(statusCode).json({ error: message });
  };
  
  module.exports = errorHandler;
  