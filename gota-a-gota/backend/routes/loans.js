const express = require('express');
const Loan = require('../models/Loan');
const Client = require('../models/Client');
const { authenticateToken, adminOrCollector } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// GET /api/loans - Obtener todos los préstamos
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, status, clientId } = req.query;
        
        const filters = {};
        if (status) filters.status = status;
        if (clientId) filters.client = clientId;

        const loans = await Loan.find(filters)
            .populate('client', 'firstName lastName cedula phone')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Loan.countDocuments(filters);

        res.json({
            loans,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error obteniendo préstamos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/loans/:id - Obtener préstamo por ID
router.get('/:id', async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id)
            .populate('client')
            .populate('createdBy', 'username');
        
        if (!loan) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        res.json(loan);
    } catch (error) {
        console.error('Error obteniendo préstamo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/loans - Crear nuevo préstamo
router.post('/', adminOrCollector, async (req, res) => {
    try {
        const { clientId, amount, interestRate, paymentFrequency, installments } = req.body;

        // Verificar que el cliente existe
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Calcular montos
        const totalAmount = amount + (amount * interestRate / 100);
        const installmentAmount = totalAmount / installments;

        // Calcular fecha de finalización
        let endDate = new Date();
        switch (paymentFrequency) {
            case 'daily':
                endDate.setDate(endDate.getDate() + installments);
                break;
            case 'weekly':
                endDate.setDate(endDate.getDate() + (installments * 7));
                break;
            case 'biweekly':
                endDate.setDate(endDate.getDate() + (installments * 14));
                break;
            case 'monthly':
                endDate.setMonth(endDate.getMonth() + installments);
                break;
        }

        const loan = new Loan({
            client: clientId,
            amount,
            interestRate,
            totalAmount,
            paymentFrequency,
            installments,
            installmentAmount,
            endDate,
            remainingAmount: totalAmount,
            createdBy: req.user._id,
            ...req.body
        });

        await loan.save();
        await loan.populate('client', 'firstName lastName cedula');
        await loan.populate('createdBy', 'username');

        res.status(201).json({
            message: 'Préstamo creado exitosamente',
            loan
        });
    } catch (error) {
        console.error('Error creando préstamo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// PUT /api/loans/:id - Actualizar préstamo
router.put('/:id', adminOrCollector, async (req, res) => {
    try {
        const loan = await Loan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('client').populate('createdBy', 'username');

        if (!loan) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        res.json({
            message: 'Préstamo actualizado exitosamente',
            loan
        });
    } catch (error) {
        console.error('Error actualizando préstamo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;