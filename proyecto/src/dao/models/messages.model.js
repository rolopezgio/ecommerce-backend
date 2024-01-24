const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
});

const messagesModelo = mongoose.model('Message', messagesSchema);

module.exports = {
    messagesModelo,
};
