const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Token de acceso requerido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Usuario no válido o inactivo' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};

// Middleware para verificar roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'No tienes permisos para realizar esta acción' 
            });
        }

        next();
    };
};

// Middleware solo para administradores
const adminOnly = authorizeRoles('admin');

// Middleware para admin y collectors
const adminOrCollector = authorizeRoles('admin', 'collector');

module.exports = {
    authenticateToken,
    authorizeRoles,
    adminOnly,
    adminOrCollector
};