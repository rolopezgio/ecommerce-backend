const isUser = (req, res, next) => {
    if (req.user && !req.user.isAdmin) {
        next();
    } else {
        res.status(403).send('Acceso prohibido');
}
};

module.exports = isUser;
