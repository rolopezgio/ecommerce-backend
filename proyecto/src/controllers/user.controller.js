const { usuariosModelo } = require('../dao/models/usuarios.modelo.js');

class UserController {
    async changeUserRole(req, res) {
        const userId = req.params.uid;
        try {
            const user = await usuariosModelo.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            user.role = user.role === 'user' ? 'premium' : 'user';
            await user.save();

            res.status(200).json({ message: 'Rol de usuario actualizado correctamente' });
        } catch (error) {
            console.error('Error al cambiar el rol del usuario:', error);
            res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
        }
    }
}

module.exports = new UserController();
