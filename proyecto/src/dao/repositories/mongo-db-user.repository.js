const UserRepository = require('./user.repository');
const { usuariosModelo } = require('../models/usuarios.modelo');

class MongoDBUserRepository extends UserRepository {
  async findById(id) {
    return usuariosModelo.findById(id);
  }

  async create(user) {
    return usuariosModelo.create(user);
  }

  async update(id, user) {
    return usuariosModelo.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id) {
    return usuariosModelo.findByIdAndDelete(id);
  }
}

module.exports = MongoDBUserRepository;
