const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    // Préstamo asociado
    loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan',
        required: true
    },
    
    // Cliente (para consultas rápidas)
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    
    // Detalles del pago
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    
    // Tipo de pago
    paymentType: {
        type: String,
        enum: ['installment', 'partial', 'full', 'interest_only'],
        default: 'installment'
    },
    
    // Método de pago
    paymentMethod: {
        type: String,
        enum: ['cash', 'transfer', 'check', 'other'],
        default: 'cash'
    },
    
    // Estado del pago
    status: {
        type: String,
        enum: ['completed', 'pending', 'cancelled'],
        default: 'completed'
    },
    
    // Información adicional
    notes: String,
    receiptNumber: String,
    
    // Usuario que registró el pago
    collectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Ubicación del pago (opcional)
    location: {
        latitude: Number,
        longitude: Number,
        address: String
    }
}, {
    timestamps: true
});

// Índices para consultas rápidas
paymentSchema.index({ loan: 1 });
paymentSchema.index({ client: 1 });
paymentSchema.index({ paymentDate: 1 });
paymentSchema.index({ collectedBy: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);