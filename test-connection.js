const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testConnection() {
    console.log('🔗 Probando conexión a MongoDB...');
    
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI no está definida');
        }
        
        console.log('📡 URI:', mongoUri.replace(/:[^:@]*@/, ':****@'));
        
        const client = new MongoClient(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            retryReads: true
        });
        
        await client.connect();
        console.log('✅ Conectado a MongoDB Atlas exitosamente');
        
        const db = client.db('finangest');
        
        // Verificar si existe el admin
        const admin = await db.collection('users').findOne({ email: 'fzuluaga548@gmail.com' });
        
        if (!admin) {
            console.log('👤 Creando usuario admin...');
            const hashedPassword = await bcrypt.hash('Pipe16137356', 10);
            await db.collection('users').insertOne({
                nombre: 'Felipe Zuluaga',
                email: 'fzuluaga548@gmail.com',
                password: hashedPassword,
                role: 'admin',
                isAdmin: true,
                activo: true,
                fechaRegistro: new Date()
            });
            console.log('✅ Usuario admin creado exitosamente');
        } else {
            console.log('👤 Usuario admin ya existe');
            console.log('   - Nombre:', admin.nombre);
            console.log('   - Email:', admin.email);
            console.log('   - Activo:', admin.activo);
            console.log('   - Role:', admin.role);
        }
        
        // Contar documentos
        const users = await db.collection('users').countDocuments();
        const clientes = await db.collection('clientes').countDocuments();
        const gastos = await db.collection('gastos').countDocuments();
        
        console.log('📊 Estadísticas de la base de datos:');
        console.log('   - Usuarios:', users);
        console.log('   - Clientes:', clientes);
        console.log('   - Gastos:', gastos);
        
        await client.close();
        console.log('🔐 Conexión cerrada');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testConnection();