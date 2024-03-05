app.get('/reset-password', (req, res) => {
    res.render('reset-password', { message: 'El enlace de restablecimiento de contraseña ha expirado. Por favor, solicita uno nuevo.' });
});
