const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createAdmin() {
    console.log('🔧 Creando usuario administrador...\n');
    
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB\n');
        
        const db = client.db('finangest');
        
        // Datos del admin
        const adminData = {
            nombre: 'Administrador',
            email: 'admin@finangest.com',
            password: 'admin123',
            role: 'admin',
            isAdmin: true,
            activo: true,
            fechaRegistro: new Date()
        };
        
        // Verificar si ya existe
        const existing = await db.collection('users').findOne({ email: adminData.email });
        if (existing) {
            console.log('⚠️  El usuario admin ya existe');
            console.log('📧 Email:', existing.email);
            console.log('👤 Nombre:', existing.nombre);
            console.log('\n💡 Si olvidaste la contraseña, elimina el usuario y ejecuta este script de nuevo\n');
            return;
        }
        
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        adminData.password = hashedPassword;
        
        // Insertar admin
        const result = await db.collection('users').insertOne(adminData);
        
        console.log('✅ ¡Admin creado exitosamente!\n');
        console.log('📧 Email: admin@finangest.com');
        console.log('🔑 Contraseña: admin123');
        console.log('🆔 ID:', result.insertedId);
        console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('🔌 Desconectado de MongoDB');
    }
}

createAdmin();
