const { UserModel } = require('../dao/models/usuarios.modelo');

const adminController = {};

adminController.showAdminPanel = async (req, res) => {
  try {
    const users = await UserModel.find({}, { nombre: 1, correo: 1, role: 1 });

    res.render('admin', { title: 'Panel de Administrador', users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

adminController.changeUserRole = async (req, res) => {
  const userId = req.params.uid;
  const newRole = req.body.role;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: 'Rol de usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al cambiar el rol del usuario:', error);
    res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
  }
};

adminController.deleteUser = async (req, res) => {
  const userId = req.params.uid;

  try {
    await UserModel.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = adminController;
