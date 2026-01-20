const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    // Información personal
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    cedula: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    
    // Dirección
    address: {
        street: String,
        neighborhood: String,
        city: String,
        department: String
    },
    
    // Información laboral
    occupation: String,
    monthlyIncome: {
        type: Number,
        default: 0
    },
    
    // Referencias
    references: [{
        name: String,
        phone: String,
        relationship: String
    }],
    
    // Estado del cliente
    status: {
        type: String,
        enum: ['active', 'inactive', 'blacklisted'],
        default: 'active'
    },
    
    // Historial crediticio
    creditScore: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    
    // Notas adicionales
    notes: String,
    
    // Usuario que creó el cliente
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Índices para búsquedas rápidas
clientSchema.index({ cedula: 1 });
clientSchema.index({ firstName: 1, lastName: 1 });
clientSchema.index({ phone: 1 });

// Virtual para nombre completo
clientSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Client', clientSchema);