const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    // Cliente asociado
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    
    // Detalles del préstamo
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    interestRate: {
        type: Number,
        required: true,
        default: 20 // 20% por defecto
    },
    totalAmount: {
        type: Number,
        required: true
    },
    
    // Modalidad de pago
    paymentFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'biweekly', 'monthly'],
        default: 'daily'
    },
    installments: {
        type: Number,
        required: true
    },
    installmentAmount: {
        type: Number,
        required: true
    },
    
    // Fechas
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    
    // Estado del préstamo
    status: {
        type: String,
        enum: ['active', 'completed', 'overdue', 'cancelled'],
        default: 'active'
    },
    
    // Montos
    paidAmount: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number,
        required: true
    },
    
    // Información adicional
    purpose: String,
    notes: String,
    
    // Usuario que creó el préstamo
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Garantías o avales
    guarantees: [{
        type: String,
        description: String
    }]
}, {
    timestamps: true
});

// Índices
loanSchema.index({ client: 1 });
loanSchema.index({ status: 1 });
loanSchema.index({ startDate: 1 });
loanSchema.index({ endDate: 1 });

// Método para calcular días de atraso
loanSchema.methods.getDaysOverdue = function() {
    if (this.status !== 'overdue') return 0;
    const today = new Date();
    const diffTime = today - this.endDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Método para calcular progreso del préstamo
loanSchema.methods.getProgress = function() {
    return (this.paidAmount / this.totalAmount) * 100;
};

module.exports = mongoose.model('Loan', loanSchema);