const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupAdminWallet() {
    console.log('🔗 Configurando cartera del administrador...');
    
    try {
        const mongoUri = process.env.MONGODB_URI;
        const client = new MongoClient(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            retryReads: true
        });
        
        await client.connect();
        console.log('✅ Conectado a MongoDB Atlas');
        
        const db = client.db('finangest');
        
        // Buscar el admin
        const admin = await db.collection('users').findOne({ email: 'fzuluaga548@gmail.com' });
        
        if (!admin) {
            console.log('❌ Usuario admin no encontrado');
            return;
        }
        
        console.log('👤 Admin encontrado:', admin.nombre);
        
        // Verificar si ya tiene carteras
        const carteras = await db.collection('carteras').find({ 
            creadoPor: admin._id.toString() 
        }).toArray();
        
        console.log('📁 Carteras existentes:', carteras.length);
        
        if (carteras.length === 0) {
            // Crear cartera principal
            const carteraPrincipal = {
                nombre: 'Cartera Principal',
                descripcion: 'Cartera principal del administrador',
                color: '#00d4ff',
                creadoPor: admin._id.toString(),
                fechaCreacion: new Date(),
                eliminada: false,
                activa: true,
                password: await bcrypt.hash('Pipe16137356', 10), // Misma contraseña del admin
                configuracion: {
                    moneda: 'COP',
                    interesDiario: 0.1,
                    diasGracia: 3
                }
            };
            
            const result = await db.collection('carteras').insertOne(carteraPrincipal);
            console.log('✅ Cartera principal creada:', result.insertedId);
        } else {
            console.log('✅ El admin ya tiene carteras configuradas');
        }
        
        // Verificar clientes y gastos
        const clientes = await db.collection('clientes').countDocuments({ creadoPor: admin._id.toString() });
        const gastos = await db.collection('gastos').countDocuments({ creadoPor: admin._id.toString() });
        
        console.log('📊 Datos del admin:');
        console.log('   - Carteras:', carteras.length);
        console.log('   - Clientes:', clientes);
        console.log('   - Gastos:', gastos);
        
        await client.close();
        console.log('🔐 Configuración completada');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setupAdminWallet();