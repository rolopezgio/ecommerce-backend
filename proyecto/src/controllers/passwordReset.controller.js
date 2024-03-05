const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const secretKey = process.env.JWT_SECRET_KEY;

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        const resetPasswordLink = `http://tuaplicacion.com/reset-password?token=${token}`;
        
        await sendResetPasswordEmail(user.email, resetPasswordLink);

        res.status(200).json({ message: 'Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña' });
    } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        res.status(500).json({ error: 'Error al solicitar restablecimiento de contraseña' });
    }
});
