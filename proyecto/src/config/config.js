const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  mongoUrl: process.env.MONGO_URL || 'mongodb+srv://rolopezgio:coder.coder@cluster0.s4105lc.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce',
  dbName: process.env.DB_NAME || 'ecommerce',
  secretKey: process.env.SECRET_KEY || 'coder.coder',
};

module.exports = config;