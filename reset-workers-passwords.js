const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function resetWorkersPasswords() {
    console.log('🔧 Reseteando contraseñas de trabajadores...\n');
    
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB\n');
        
        const db = client.db('finangest');
        
        // Obtener todos los trabajadores
        const workers = await db.collection('users').find({ 
            role: 'worker' 
        }).toArray();
        
        console.log(`📋 Encontrados ${workers.length} trabajadores\n`);
        
        // Contraseña por defecto para todos
        const defaultPassword = 'Pipe16137356';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        
        for (const worker of workers) {
            await db.collection('users').updateOne(
                { _id: worker._id },
                { 
                    $set: { 
                        password: hashedPassword,
                        activo: true  // Activar también
                    } 
                }
            );
            
            console.log(`✅ ${worker.nombre} (${worker.email})`);
        }
        
        console.log(`\n🎉 ¡${workers.length} contraseñas actualizadas!\n`);
        console.log('🔑 Contraseña para todos: Pipe16137356\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('🔌 Desconectado de MongoDB');
    }
}

resetWorkersPasswords();
