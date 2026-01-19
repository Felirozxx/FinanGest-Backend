const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function makeUserAdmin() {
    console.log('🔧 Convirtiendo usuario en administrador...\n');
    
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB\n');
        
        const db = client.db('finangest');
        
        const email = 'fzuluaga548@gmail.com';
        const newPassword = 'Pipe16137356';
        
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar usuario existente a admin
        const result = await db.collection('users').updateOne(
            { email: email },
            { 
                $set: { 
                    password: hashedPassword,
                    role: 'admin',
                    isAdmin: true,
                    activo: true
                } 
            }
        );
        
        if (result.matchedCount === 0) {
            console.log('❌ No se encontró el usuario\n');
        } else {
            console.log('✅ ¡Usuario actualizado a admin exitosamente!\n');
            console.log('📧 Email: fzuluaga548@gmail.com');
            console.log('🔑 Contraseña: Pipe16137356');
            console.log('👑 Rol: admin\n');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('🔌 Desconectado de MongoDB');
    }
}

makeUserAdmin();
