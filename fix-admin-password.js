const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function fixAdminPassword() {
    console.log('🔧 Arreglando contraseña del admin...\n');
    
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB\n');
        
        const db = client.db('finangest');
        
        // Actualizar contraseña del admin principal
        const newPassword = 'Pipe16137356';
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const result = await db.collection('users').updateOne(
            { email: 'fzuluaga548@gmail.com' },
            { 
                $set: { 
                    password: hashedPassword
                } 
            }
        );
        
        if (result.matchedCount > 0) {
            console.log('✅ Contraseña actualizada para fzuluaga548@gmail.com');
            console.log('🔑 Nueva contraseña: Pipe16137356\n');
        } else {
            console.log('❌ No se encontró el usuario\n');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('🔌 Desconectado de MongoDB');
    }
}

fixAdminPassword();