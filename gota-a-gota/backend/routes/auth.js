const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generar JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });

        if (existingUser) {
            // Mensaje específico según qué campo está duplicado
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({
                    message: 'El correo electrónico ya está registrado. Por favor usa otro correo o inicia sesión.',
                    field: 'email'
                });
            }
            if (existingUser.username === username) {
                return res.status(400).json({
                    message: 'El nombre de usuario ya está en uso. Por favor elige otro.',
                    field: 'username'
                });
            }
            return res.status(400).json({
                message: 'Usuario o email ya existe'
            });
        }

        // Crear nuevo usuario
        const user = new User({
            username,
            email: email.toLowerCase(),
            password,
            role: role || 'collector'
        });

        await user.save();

        // Generar token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        
        // Manejar error de duplicado de MongoDB
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `El ${field === 'email' ? 'correo electrónico' : 'nombre de usuario'} ya está registrado. Por favor usa otro.`,
                field: field
            });
        }
        
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario (case-insensitive para email, case-sensitive para username)
        const user = await User.findOne({
            $or: [
                { username: username }, // Case-sensitive para username
                { email: username.toLowerCase() } // Case-insensitive para email
            ]
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        // Verificar password (case-sensitive)
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user._id);

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', authenticateToken, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// POST /api/auth/logout - Cerrar sesión (opcional, el token expira automáticamente)
router.post('/logout', authenticateToken, (req, res) => {
    res.json({ message: 'Sesión cerrada exitosamente' });
});

module.exports = router;