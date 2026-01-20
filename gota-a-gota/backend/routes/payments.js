const express = require('express');
const Payment = require('../models/Payment');
const Loan = require('../models/Loan');
const { authenticateToken, adminOrCollector } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// GET /api/payments - Obtener todos los pagos
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, loanId, clientId, startDate, endDate } = req.query;
        
        const filters = {};
        if (loanId) filters.loan = loanId;
        if (clientId) filters.client = clientId;
        if (startDate || endDate) {
            filters.paymentDate = {};
            if (startDate) filters.paymentDate.$gte = new Date(startDate);
            if (endDate) filters.paymentDate.$lte = new Date(endDate);
        }

        const payments = await Payment.find(filters)
            .populate('loan', 'amount totalAmount')
            .populate('client', 'firstName lastName cedula')
            .populate('collectedBy', 'username')
            .sort({ paymentDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Payment.countDocuments(filters);

        res.json({
            payments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error obteniendo pagos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/payments - Registrar nuevo pago
router.post('/', adminOrCollector, async (req, res) => {
    try {
        const { loanId, amount, paymentType, paymentMethod, notes } = req.body;

        // Verificar que el préstamo existe
        const loan = await Loan.findById(loanId).populate('client');
        if (!loan) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        // Verificar que el monto no exceda lo que falta por pagar
        if (amount > loan.remainingAmount) {
            return res.status(400).json({
                message: 'El monto excede lo que falta por pagar'
            });
        }

        // Crear el pago
        const payment = new Payment({
            loan: loanId,
            client: loan.client._id,
            amount,
            paymentType: paymentType || 'installment',
            paymentMethod: paymentMethod || 'cash',
            notes,
            collectedBy: req.user._id
        });

        await payment.save();

        // Actualizar el préstamo
        loan.paidAmount += amount;
        loan.remainingAmount -= amount;

        // Verificar si el préstamo está completamente pagado
        if (loan.remainingAmount <= 0) {
            loan.status = 'completed';
            loan.remainingAmount = 0;
        }

        await loan.save();

        await payment.populate('loan', 'amount totalAmount');
        await payment.populate('client', 'firstName lastName cedula');
        await payment.populate('collectedBy', 'username');

        res.status(201).json({
            message: 'Pago registrado exitosamente',
            payment,
            loanUpdated: {
                paidAmount: loan.paidAmount,
                remainingAmount: loan.remainingAmount,
                status: loan.status
            }
        });
    } catch (error) {
        console.error('Error registrando pago:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/payments/loan/:loanId - Obtener pagos de un préstamo específico
router.get('/loan/:loanId', async (req, res) => {
    try {
        const payments = await Payment.find({ loan: req.params.loanId })
            .populate('collectedBy', 'username')
            .sort({ paymentDate: -1 });

        res.json(payments);
    } catch (error) {
        console.error('Error obteniendo pagos del préstamo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// DELETE /api/payments/:id - Cancelar pago
router.delete('/:id', adminOrCollector, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        // Solo se pueden cancelar pagos completados
        if (payment.status !== 'completed') {
            return res.status(400).json({
                message: 'Solo se pueden cancelar pagos completados'
            });
        }

        // Actualizar el préstamo (revertir el pago)
        const loan = await Loan.findById(payment.loan);
        if (loan) {
            loan.paidAmount -= payment.amount;
            loan.remainingAmount += payment.amount;
            if (loan.status === 'completed' && loan.remainingAmount > 0) {
                loan.status = 'active';
            }
            await loan.save();
        }

        // Marcar el pago como cancelado
        payment.status = 'cancelled';
        await payment.save();

        res.json({ message: 'Pago cancelado exitosamente' });
    } catch (error) {
        console.error('Error cancelando pago:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;