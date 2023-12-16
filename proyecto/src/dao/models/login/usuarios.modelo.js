const mongoose = require('mongoose');

const usuariosColeccion = 'usuarios';

const usuariosEsquema=new mongoose.Schema(
    {
        nombre: String,
        email: {
            type: String, unique: true
        },
        password: String
    },
    {
        timestamps: {
            updatedAt: "FechaUltMod", createdAt: "FechaAlta"
        }
    }
)

const usuariosModelo = mongoose.model(usuariosColeccion, usuariosEsquema);

module.exports = { usuariosModelo };