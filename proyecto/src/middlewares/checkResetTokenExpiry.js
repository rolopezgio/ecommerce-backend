const jwt = require('jsonwebtoken');

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const decodedToken = jwt.verify(token, secretKey);
        const userId = decodedToken.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.password === newPassword) {
            return res.status(400).json({ error: 'No puedes usar la misma contraseña anterior' });
        }

        res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'El enlace de restablecimiento de contraseña ha expirado' });
        }
        console.error('Error al restablecer contraseña:', error);
        res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
});