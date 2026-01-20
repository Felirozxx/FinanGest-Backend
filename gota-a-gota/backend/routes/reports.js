const express = require('express');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const Client = require('../models/Client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// GET /api/reports/dashboard - Dashboard principal
router.get('/dashboard', async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

        // Estadísticas generales
        const totalClients = await Client.countDocuments({ status: 'active' });
        const totalLoans = await Loan.countDocuments();
        const activeLoans = await Loan.countDocuments({ status: 'active' });
        const overdueLoans = await Loan.countDocuments({ status: 'overdue' });

        // Montos totales
        const totalLoanAmount = await Loan.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalCollected = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const pendingAmount = await Loan.aggregate([
            { $match: { status: { $in: ['active', 'overdue'] } } },
            { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
        ]);

        // Pagos de hoy
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayPayments = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: todayStart, $lte: todayEnd },
                    status: 'completed'
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        // Pagos de esta semana
        const weekPayments = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: startOfWeek },
                    status: 'completed'
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Pagos del mes
        const monthPayments = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: startOfMonth },
                    status: 'completed'
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            clients: {
                total: totalClients
            },
            loans: {
                total: totalLoans,
                active: activeLoans,
                overdue: overdueLoans,
                completed: totalLoans - activeLoans - overdueLoans
            },
            amounts: {
                totalLent: totalLoanAmount[0]?.total || 0,
                totalCollected: totalCollected[0]?.total || 0,
                pending: pendingAmount[0]?.total || 0
            },
            collections: {
                today: {
                    amount: todayPayments[0]?.total || 0,
                    count: todayPayments[0]?.count || 0
                },
                week: weekPayments[0]?.total || 0,
                month: monthPayments[0]?.total || 0
            }
        });
    } catch (error) {
        console.error('Error generando dashboard:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/reports/collections - Reporte de cobranzas
router.get('/collections', async (req, res) => {
    try {
        const { startDate, endDate, collectorId } = req.query;
        
        const filters = { status: 'completed' };
        
        if (startDate || endDate) {
            filters.paymentDate = {};
            if (startDate) filters.paymentDate.$gte = new Date(startDate);
            if (endDate) filters.paymentDate.$lte = new Date(endDate);
        }
        
        if (collectorId) {
            filters.collectedBy = collectorId;
        }

        const collections = await Payment.aggregate([
            { $match: filters },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } },
                        collector: '$collectedBy'
                    },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id.collector',
                    foreignField: '_id',
                    as: 'collector'
                }
            },
            { $sort: { '_id.date': -1 } }
        ]);

        res.json(collections);
    } catch (error) {
        console.error('Error generando reporte de cobranzas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/reports/overdue - Préstamos vencidos
router.get('/overdue', async (req, res) => {
    try {
        const overdueLoans = await Loan.find({
            status: 'overdue'
        })
        .populate('client', 'firstName lastName cedula phone')
        .populate('createdBy', 'username')
        .sort({ endDate: 1 });

        const overdueWithDays = overdueLoans.map(loan => ({
            ...loan.toObject(),
            daysOverdue: loan.getDaysOverdue()
        }));

        res.json(overdueWithDays);
    } catch (error) {
        console.error('Error obteniendo préstamos vencidos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/reports/client/:clientId - Reporte de cliente específico
router.get('/client/:clientId', async (req, res) => {
    try {
        const clientId = req.params.clientId;

        // Información del cliente
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Préstamos del cliente
        const loans = await Loan.find({ client: clientId })
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        // Pagos del cliente
        const payments = await Payment.find({ client: clientId })
            .populate('loan', 'amount totalAmount')
            .populate('collectedBy', 'username')
            .sort({ paymentDate: -1 });

        // Estadísticas
        const totalBorrowed = loans.reduce((sum, loan) => sum + loan.amount, 0);
        const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const activeLoan = loans.find(loan => loan.status === 'active');

        res.json({
            client,
            loans,
            payments,
            statistics: {
                totalLoans: loans.length,
                totalBorrowed,
                totalPaid,
                hasActiveLoan: !!activeLoan,
                activeLoanAmount: activeLoan?.remainingAmount || 0
            }
        });
    } catch (error) {
        console.error('Error generando reporte de cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;