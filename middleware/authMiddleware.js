function authMiddleware(req, res, next) {
    if (req.session.user) {
        next(); // El usuario está autenticado, continúa
    } else {
        res.redirect('/login'); // Redirige al login si no está autenticado
    }
}

module.exports = authMiddleware;
