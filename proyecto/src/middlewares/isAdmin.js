const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).send('Acceso prohibido para usuarios no administradores');
}
};

module.exports = isAdmin;
