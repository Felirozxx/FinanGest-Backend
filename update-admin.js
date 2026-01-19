const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function updateAdmin() {
    console.log('🔧 Actualizando usuario administrador...\n');
    
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB\n');
        
        const db = client.db('finangest');
        
        // Nuevos datos del admin
        const newEmail = 'fzuluaga548@gmail.com';
        const newPassword = 'Pipe16137356';
        
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar el admin existente
        const result = await db.collection('users').updateOne(
            { email: 'admin@finangest.com' },
            { 
                $set: { 
                    email: newEmail,
                    password: hashedPassword
                } 
            }
        );
        
        if (result.matchedCount === 0) {
            console.log('⚠️  No se encontró el admin anterior, creando uno nuevo...\n');
            
            await db.collection('users').insertOne({
                nombre: 'Administrador',
                email: newEmail,
                password: hashedPassword,
                role: 'admin',
                isAdmin: true,
                activo: true,
                fechaRegistro: new Date()
            });
            
            console.log('✅ ¡Admin creado exitosamente!\n');
        } else {
            console.log('✅ ¡Admin actualizado exitosamente!\n');
        }
        
        console.log('📧 Email: fzuluaga548@gmail.com');
        console.log('🔑 Contraseña: Pipe16137356\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('🔌 Desconectado de MongoDB');
    }
}

updateAdmin();
