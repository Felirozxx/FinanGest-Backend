const { MongoClient } = require('mongodb');
require('dotenv').config();

async function listAllUsers() {
    console.log('👥 Listando todos los usuarios...\n');
    
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB\n');
        
        const db = client.db('finangest');
        
        const users = await db.collection('users').find({}).toArray();
        
        console.log(`📋 Total de usuarios: ${users.length}\n`);
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.nombre || 'Sin nombre'}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   👤 Role: ${user.role || 'Sin role'}`);
            console.log(`   ✅ Activo: ${user.activo ? 'Sí' : 'No'}`);
            console.log(`   🔒 Bloqueado: ${user.bloqueado ? 'Sí' : 'No'}`);
            console.log(`   🆔 ID: ${user._id}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('🔌 Desconectado de MongoDB');
    }
}

listAllUsers();
