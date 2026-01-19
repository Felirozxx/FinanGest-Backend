const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function activateAllClients() {
    console.log('🔧 Activando y reseteando contraseñas de clientes...\n');
    
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB\n');
        
        const db = client.db('finangest');
        
        // Contraseña por defecto
        const defaultPassword = 'Pipe16137356';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        
        // Actualizar todos los usuarios con role 'client'
        const result = await db.collection('users').updateMany(
            { role: 'client' },
            { 
                $set: { 
                    password: hashedPassword,
                    activo: true,
                    bloqueado: false
                } 
            }
        );
        
        console.log(`✅ ${result.modifiedCount} usuarios actualizados\n`);
        
        // Mostrar usuarios actualizados
        const users = await db.collection('users').find({ role: 'client' }).toArray();
        
        console.log('📋 Usuarios activados:\n');
        users.forEach(user => {
            console.log(`✅ ${user.nombre} (${user.email})`);
        });
        
        console.log('\n🔑 Contraseña para todos: Pipe16137356\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('🔌 Desconectado de MongoDB');
    }
}

activateAllClients();
