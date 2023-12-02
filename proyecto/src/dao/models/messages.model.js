const mongoose = require('mongoose');

const messagesColeccion = 'messages'
const messagesEsquema = new mongoose.Schema(
    {
        user: String,
        message: String,
    },
    { timestamps: true }
);

const messagesModelo = mongoose.model(messagesColeccion, messagesEsquema);

module.exports = { messagesModelo };