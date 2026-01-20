const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gota-a-gota');
        console.log('✅ Conectado a MongoDB');

        // Verificar si ya existe un admin
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('⚠️  Ya existe un usuario administrador');
            process.exit(0);
        }

        // Crear usuario administrador
        const adminUser = new User({
            username: 'admin',
            email: 'admin@gotaagota.com',
            password: 'admin123', // Se hasheará automáticamente
            role: 'admin'
        });

        await adminUser.save();
        console.log('✅ Usuario administrador creado exitosamente');
        console.log('📧 Email: admin@gotaagota.com');
        console.log('🔑 Usuario: admin');
        console.log('🔒 Contraseña: admin123');
        console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

    } catch (error) {
        console.error('❌ Error creando administrador:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

createAdmin();