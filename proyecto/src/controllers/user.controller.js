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

    async uploadDocuments(req, res) {
        const userId = req.params.uid;
        const documents = req.files;

        try {
            const user = await usuariosModelo.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            user.documents = documents.map(file => ({
                name: file.originalname,
                reference: `/uploads/${file.filename}`
            }));
            
            user.last_connection = new Date();

            const requiredDocuments = ['identificacion', 'comprobante de domicilio', 'comprobante de estado de cuenta'];
            const hasAllDocuments = requiredDocuments.every(doc => user.documents.some(d => d.name === doc));
            if (!hasAllDocuments) {
                return res.status(400).json({ error: 'El usuario no ha cargado todos los documentos requeridos' });
            }

            await user.save();

            res.status(200).json({ message: 'Documentos subidos correctamente' });
        } catch (error) {
            console.error('Error al subir los documentos:', error);
            res.status(500).json({ error: 'Error al subir los documentos' });
        }
    }
}

module.exports = new UserController();
