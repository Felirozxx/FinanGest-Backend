const express = require('express');
const Client = require('../models/Client');
const { authenticateToken, adminOrCollector } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/clients - Obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status } = req.query;
        
        // Construir filtros
        const filters = {};
        if (search) {
            filters.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { cedula: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) {
            filters.status = status;
        }

        const clients = await Client.find(filters)
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Client.countDocuments(filters);

        res.json({
            clients,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error obteniendo clientes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/clients/:id - Obtener cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id)
            .populate('createdBy', 'username');
        
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json(client);
    } catch (error) {
        console.error('Error obteniendo cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/clients - Crear nuevo cliente
router.post('/', adminOrCollector, async (req, res) => {
    try {
        const clientData = {
            ...req.body,
            createdBy: req.user._id
        };

        // Verificar si ya existe un cliente con esa cédula
        const existingClient = await Client.findOne({ cedula: clientData.cedula });
        if (existingClient) {
            return res.status(400).json({
                message: 'Ya existe un cliente con esa cédula'
            });
        }

        const client = new Client(clientData);
        await client.save();
        
        await client.populate('createdBy', 'username');

        res.status(201).json({
            message: 'Cliente creado exitosamente',
            client
        });
    } catch (error) {
        console.error('Error creando cliente:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Ya existe un cliente con esa cédula'
            });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// PUT /api/clients/:id - Actualizar cliente
router.put('/:id', adminOrCollector, async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('createdBy', 'username');

        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({
            message: 'Cliente actualizado exitosamente',
            client
        });
    } catch (error) {
        console.error('Error actualizando cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// DELETE /api/clients/:id - Eliminar cliente (soft delete)
router.delete('/:id', adminOrCollector, async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            { status: 'inactive' },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente desactivado exitosamente' });
    } catch (error) {
        console.error('Error eliminando cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;