const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection - Optimizado para Vercel con reintentos
let cachedClient = null;
let cachedDb = null;
let connectionAttempts = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos

async function connectToDatabase(retryCount = 0) {
    // Verificar conexión existente
    if (cachedDb && cachedClient) {
        try {
            // Verificar que la conexión sigue activa con timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            await cachedClient.db('admin').command({ ping: 1 });
            clearTimeout(timeoutId);
            return cachedDb;
        } catch (e) {
            console.log('🔄 Reconectando a MongoDB...');
            cachedClient = null;
            cachedDb = null;
        }
    }

    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI no está definida en las variables de entorno. Configúrala en Vercel.');
        }
        
        console.log(`🔗 Conectando a MongoDB Atlas (intento ${retryCount + 1}/${MAX_RETRIES})...`);
        
        const client = new MongoClient(mongoUri, {
            maxPoolSize: 10,
            minPoolSize: 5,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            socketTimeoutMS: 60000,
            retryWrites: true,
            retryReads: true,
            waitQueueTimeoutMS: 20000,
            heartbeatFrequencyMS: 10000,
            // Configuración para Vercel
            appName: 'FinanGest',
            compressors: ['snappy', 'zlib']
        });
        
        await client.connect();
        
        // Verificar conexión antes de cachear
        await client.db('admin').command({ ping: 1 });
        
        cachedClient = client;
        cachedDb = client.db('finangest');
        console.log('✅ Conectado a MongoDB Atlas exitosamente');
        connectionAttempts = 0;
        return cachedDb;
        
    } catch (e) {
        console.error(`❌ Error conectando a MongoDB (intento ${retryCount + 1}):`, e.message);
        cachedClient = null;
        cachedDb = null;
        
        // Reintentar si no hemos alcanzado el límite
        if (retryCount < MAX_RETRIES - 1) {
            console.log(`⏳ Reintentando en ${RETRY_DELAY}ms...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return connectToDatabase(retryCount + 1);
        }
        
        // Lanzar error descriptivo después de reintentos
        const errorMsg = e.message.includes('ENOTFOUND') 
            ? 'No se puede conectar a MongoDB Atlas. Verifica tu conexión a internet y que MONGODB_URI sea correcta.'
            : e.message.includes('authentication failed')
            ? 'Error de autenticación con MongoDB. Verifica tu usuario y contraseña en MONGODB_URI.'
            : e.message.includes('IP address')
            ? 'Tu IP no está autorizada en MongoDB Atlas. Ve a Network Access y agrega 0.0.0.0/0'
            : `Error de conexión a la base de datos: ${e.message}`;
        
        throw new Error(errorMsg);
    }
}

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Códigos de verificación temporales
const verificationCodes = {};

// ============ AUTH ROUTES ============

// Crear admin (solo para setup inicial - ELIMINAR DESPUÉS)
app.post('/api/create-admin', async (req, res) => {
    try {
        const { email, password, nombre } = req.body;
        
        const db = await connectToDatabase();
        const existing = await db.collection('users').findOne({ email });
        if (existing) return res.json({ success: false, error: 'Usuario ya existe' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('users').insertOne({
            nombre: nombre || 'Administrador',
            email,
            password: hashedPassword,
            role: 'admin',
            isAdmin: true,
            activo: true,
            fechaRegistro: new Date()
        });
        
        res.json({ success: true, message: 'Admin creado exitosamente' });
    } catch (e) {
        console.error('Error creando admin:', e);
        res.json({ success: false, error: 'Error creando admin: ' + e.message });
    }
});

// Enviar código de verificación
app.post('/api/send-code', async (req, res) => {
    const { email, nombre } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = { code, nombre, expires: Date.now() + 600000 };
    
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🔐 Código de Verificación - FinanGest',
            html: `<div style="font-family: Arial; padding: 20px; background: #1a1a2e; color: #fff;">
                <h2 style="color: #00d4ff;">FinanGest Software</h2>
                <p>Hola ${nombre},</p>
                <p>Tu código de verificación es:</p>
                <h1 style="color: #00ff88; font-size: 40px; letter-spacing: 10px;">${code}</h1>
                <p>Este código expira en 10 minutos.</p>
            </div>`
        });
        res.json({ success: true });
    } catch (e) {
        res.json({ success: false, error: 'Error enviando email' });
    }
});

// Verificar código y crear usuario
app.post('/api/verify-code', async (req, res) => {
    const { email, code, password } = req.body;
    const stored = verificationCodes[email];
    
    if (!stored || stored.code !== code || Date.now() > stored.expires) {
        return res.json({ success: false, error: 'Código inválido o expirado' });
    }
    
    try {
        const db = await connectToDatabase();
        const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.json({ 
                success: false, 
                error: 'Este correo electrónico ya está registrado. Por favor inicia sesión o usa otro correo.' 
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({
            nombre: stored.nombre,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'worker',
            activo: false,
            fechaRegistro: new Date()
        });
        
        delete verificationCodes[email];
        res.json({ success: true, userId: result.insertedId, nombre: stored.nombre, email: email.toLowerCase() });
    } catch (e) {
        console.error('Error creando usuario:', e);
        
        // Manejar error de duplicado de MongoDB (E11000)
        if (e.code === 11000) {
            return res.json({ 
                success: false, 
                error: 'Este correo electrónico ya está registrado. Por favor inicia sesión o usa otro correo.' 
            });
        }
        
        res.json({ success: false, error: 'Error creando usuario. Por favor intenta nuevamente.' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ 
            $or: [
                { email: email.toLowerCase() }, 
                { username: email }
            ] 
        });
        
        if (!user) return res.json({ success: false, error: 'Usuario no encontrado' });
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.json({ success: false, error: 'Contraseña incorrecta' });
        
        if (!user.activo && user.role !== 'admin') {
            return res.json({ success: false, error: 'Cuenta pendiente de activación', pendingActivation: true, userId: user._id, nombre: user.nombre, email: user.email });
        }
        
        res.json({ 
            success: true, 
            user: { id: user._id, nombre: user.nombre, email: user.email, role: user.role }
        });
    } catch (e) {
        console.error('Error en login:', e);
        res.json({ success: false, error: 'Error de conexión. Por favor intenta nuevamente.' });
    }
});

// Notificar pago al admin
app.post('/api/notify-payment', async (req, res) => {
    const { userId, userName, userEmail } = req.body;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: '💰 Nuevo Pago Pendiente - FinanGest',
            html: `<div style="font-family: Arial; padding: 20px;">
                <h2>Nuevo usuario pendiente de activación</h2>
                <p><strong>Nombre:</strong> ${userName}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>ID:</strong> ${userId}</p>
                <p>El usuario indica que ya realizó el pago. Verifica y activa su cuenta.</p>
            </div>`
        });
        res.json({ success: true });
    } catch (e) {
        res.json({ success: false });
    }
});

// Forgot password endpoint
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ email });
        
        if (!user) {
            return res.json({ success: false, error: 'Usuario no encontrado' });
        }
        
        // Generate reset code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        verificationCodes[email] = { 
            code: resetCode, 
            type: 'reset',
            expires: Date.now() + 600000 // 10 minutes
        };
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🔐 Código de Recuperación - FinanGest',
            html: `<div style="font-family: Arial; padding: 20px; background: #1a1a2e; color: #fff;">
                <h2 style="color: #00d4ff;">FinanGest Software</h2>
                <p>Hola ${user.nombre},</p>
                <p>Tu código de recuperación de contraseña es:</p>
                <h1 style="color: #00ff88; font-size: 40px; letter-spacing: 10px;">${resetCode}</h1>
                <p>Este código expira en 10 minutos.</p>
            </div>`
        });
        
        res.json({ success: true });
    } catch (e) {
        console.error('Error enviando código de recuperación:', e);
        res.json({ success: false, error: 'Error enviando email' });
    }
});

// Reset password endpoint
app.post('/api/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
        const stored = verificationCodes[email];
        
        if (!stored || stored.code !== code || stored.type !== 'reset' || Date.now() > stored.expires) {
            return res.json({ success: false, error: 'Código inválido o expirado' });
        }
        
        const db = await connectToDatabase();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await db.collection('users').updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );
        
        delete verificationCodes[email];
        res.json({ success: true });
    } catch (e) {
        console.error('Error reseteando contraseña:', e);
        res.json({ success: false, error: 'Error reseteando contraseña' });
    }
});

// Reset user data endpoint
app.post('/api/reset-datos-usuario', async (req, res) => {
    const { userId } = req.body;
    try {
        const db = await connectToDatabase();
        
        // Delete user's clients and expenses
        await db.collection('clientes').deleteMany({ creadoPor: userId });
        await db.collection('gastos').deleteMany({ creadoPor: userId });
        await db.collection('carteras').deleteMany({ creadoPor: userId });
        
        res.json({ success: true });
    } catch (e) {
        console.error('Error reseteando datos de usuario:', e);
        res.json({ success: false, error: 'Error reseteando datos' });
    }
});

// ============ USERS ROUTES ============

app.get('/api/users', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const users = await db.collection('users').find({}).toArray();
        res.json(users.map(u => ({ ...u, id: u._id })));
    } catch (e) {
        console.error('Error en /api/users:', e);
        res.status(500).json({ error: 'Error obteniendo usuarios: ' + e.message });
    }
});

app.put('/api/users/:id/activate', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('users').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { activo: true } }
        );
        res.json({ success: true });
    } catch (e) {
        console.error('Error activando usuario:', e);
        res.status(500).json({ error: 'Error activando usuario: ' + e.message });
    }
});

app.put('/api/users/:id/block', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
        await db.collection('users').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { bloqueado: !user.bloqueado } }
        );
        res.json({ success: true });
    } catch (e) {
        console.error('Error bloqueando usuario:', e);
        res.status(500).json({ error: 'Error bloqueando usuario: ' + e.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (e) {
        console.error('Error eliminando usuario:', e);
        res.status(500).json({ error: 'Error eliminando usuario: ' + e.message });
    }
});

// ============ CARTERAS ROUTES ============

app.get('/api/carteras/:userId', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { userId } = req.params;
        const carteras = await db.collection('carteras').find({ 
            creadoPor: userId,
            eliminada: { $ne: true }
        }).toArray();
        res.json({ 
            success: true, 
            carteras: carteras.map(c => ({ ...c, id: c._id }))
        });
    } catch (e) {
        console.error('Error obteniendo carteras:', e);
        res.status(500).json({ success: false, error: 'Error obteniendo carteras: ' + e.message });
    }
});

app.post('/api/carteras', async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        if (!db) {
            return res.status(500).json({ 
                success: false, 
                error: 'Error de conexión con la base de datos. Por favor verifica tu conexión a internet e intenta nuevamente.' 
            });
        }
        
        const cartera = { 
            ...req.body, 
            fechaCreacion: new Date(),
            eliminada: false,
            activa: true
        };
        
        const result = await db.collection('carteras').insertOne(cartera);
        res.json({ 
            success: true, 
            id: result.insertedId, 
            cartera: { ...cartera, id: result.insertedId } 
        });
    } catch (e) {
        console.error('Error creando cartera:', e);
        res.status(500).json({ 
            success: false, 
            error: 'Error de conexión. Verifica que tu IP esté autorizada en MongoDB Atlas y que MONGODB_URI esté configurada correctamente en Vercel.' 
        });
    }
});

app.put('/api/carteras/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { id } = req.params;
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.id;
        
        await db.collection('carteras').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        res.json({ success: true });
    } catch (e) {
        console.error('Error actualizando cartera:', e);
        res.status(500).json({ success: false, error: 'Error actualizando cartera: ' + e.message });
    }
});

app.post('/api/carteras/:id/eliminar', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { id } = req.params;
        
        // Soft delete - marcar como eliminada
        await db.collection('carteras').updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    eliminada: true, 
                    fechaEliminacion: new Date() 
                } 
            }
        );
        res.json({ success: true });
    } catch (e) {
        console.error('Error eliminando cartera:', e);
        res.status(500).json({ success: false, error: 'Error eliminando cartera: ' + e.message });
    }
});

app.get('/api/carteras-eliminadas', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { userId } = req.query;
        const carteras = await db.collection('carteras').find({ 
            creadoPor: userId,
            eliminada: true
        }).toArray();
        res.json({ 
            success: true, 
            carteras: carteras.map(c => ({ ...c, id: c._id }))
        });
    } catch (e) {
        console.error('Error obteniendo carteras eliminadas:', e);
        res.status(500).json({ success: false, error: 'Error obteniendo carteras eliminadas: ' + e.message });
    }
});

app.post('/api/carteras/:id/restablecer', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { id } = req.params;
        
        // Restaurar cartera eliminada
        await db.collection('carteras').updateOne(
            { _id: new ObjectId(id) },
            { 
                $unset: { 
                    eliminada: "",
                    fechaEliminacion: ""
                } 
            }
        );
        res.json({ success: true });
    } catch (e) {
        console.error('Error restableciendo cartera:', e);
        res.status(500).json({ success: false, error: 'Error restableciendo cartera: ' + e.message });
    }
});

app.delete('/api/carteras/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('carteras').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (e) {
        console.error('Error eliminando cartera permanentemente:', e);
        res.status(500).json({ success: false, error: 'Error eliminando cartera: ' + e.message });
    }
});

app.post('/api/renovar-carteras', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { carteraIds } = req.body;
        
        // Renovar carteras (actualizar fecha de vencimiento)
        const fechaVencimiento = new Date();
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1); // +1 mes
        
        await db.collection('carteras').updateMany(
            { _id: { $in: carteraIds.map(id => new ObjectId(id)) } },
            { $set: { fechaVencimiento, renovada: true } }
        );
        
        res.json({ success: true });
    } catch (e) {
        console.error('Error renovando carteras:', e);
        res.status(500).json({ success: false, error: 'Error renovando carteras: ' + e.message });
    }
});

// ============ CLIENTES ROUTES ============

app.get('/api/clientes', async (req, res) => {
    const { userId } = req.query;
    try {
        const db = await connectToDatabase();
        const query = userId ? { creadoPor: userId } : {};
        const clientes = await db.collection('clientes').find(query).toArray();
        res.json(clientes.map(c => ({ ...c, id: c._id })));
    } catch (e) {
        console.error('Error obteniendo clientes:', e);
        res.status(500).json({ error: 'Error obteniendo clientes: ' + e.message });
    }
});

app.post('/api/clientes', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const cliente = { ...req.body, fechaCreacion: new Date() };
        const result = await db.collection('clientes').insertOne(cliente);
        res.json({ success: true, id: result.insertedId, cliente: { ...cliente, id: result.insertedId } });
    } catch (e) {
        console.error('Error creando cliente:', e);
        res.status(500).json({ error: 'Error creando cliente: ' + e.message });
    }
});

app.put('/api/clientes/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { id } = req.params;
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.id;
        
        await db.collection('clientes').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        res.json({ success: true });
    } catch (e) {
        console.error('Error actualizando cliente:', e);
        res.status(500).json({ error: 'Error actualizando cliente: ' + e.message });
    }
});

app.delete('/api/clientes/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('clientes').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (e) {
        console.error('Error eliminando cliente:', e);
        res.status(500).json({ error: 'Error eliminando cliente: ' + e.message });
    }
});

// ============ ADMIN CLIENTES ROUTES ============

app.put('/api/admin/cliente/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { id } = req.params;
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.id;
        
        // Crear backup antes de editar
        const cliente = await db.collection('clientes').findOne({ _id: new ObjectId(id) });
        if (cliente) {
            await db.collection('backups').insertOne({
                tipo: 'edit_cliente',
                clienteId: id,
                datosAnteriores: cliente,
                fecha: new Date()
            });
        }
        
        await db.collection('clientes').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        res.json({ success: true });
    } catch (e) {
        console.error('Error actualizando cliente:', e);
        res.status(500).json({ error: 'Error actualizando cliente: ' + e.message });
    }
});

app.delete('/api/admin/cliente/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const cliente = await db.collection('clientes').findOne({ _id: new ObjectId(req.params.id) });
        if (cliente) {
            await db.collection('backups').insertOne({
                tipo: 'delete_cliente',
                clienteId: req.params.id,
                datosEliminados: cliente,
                fecha: new Date()
            });
        }
        
        await db.collection('clientes').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (e) {
        console.error('Error eliminando cliente:', e);
        res.status(500).json({ error: 'Error eliminando cliente: ' + e.message });
    }
});

// ============ GASTOS ROUTES ============

app.get('/api/gastos', async (req, res) => {
    const { userId } = req.query;
    try {
        const db = await connectToDatabase();
        const query = userId ? { creadoPor: userId } : {};
        const gastos = await db.collection('gastos').find(query).toArray();
        res.json(gastos.map(g => ({ ...g, id: g._id })));
    } catch (e) {
        console.error('Error obteniendo gastos:', e);
        res.status(500).json({ error: 'Error obteniendo gastos: ' + e.message });
    }
});

app.post('/api/gastos', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const gasto = { ...req.body, fechaCreacion: new Date() };
        const result = await db.collection('gastos').insertOne(gasto);
        res.json({ success: true, id: result.insertedId });
    } catch (e) {
        console.error('Error creando gasto:', e);
        res.status(500).json({ error: 'Error creando gasto: ' + e.message });
    }
});

app.delete('/api/gastos/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('gastos').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (e) {
        console.error('Error eliminando gasto:', e);
        res.status(500).json({ error: 'Error eliminando gasto: ' + e.message });
    }
});

app.put('/api/admin/gasto/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { id } = req.params;
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.id;
        
        await db.collection('gastos').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        res.json({ success: true });
    } catch (e) {
        console.error('Error actualizando gasto:', e);
        res.status(500).json({ error: 'Error actualizando gasto: ' + e.message });
    }
});

app.delete('/api/admin/gasto/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('gastos').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (e) {
        console.error('Error eliminando gasto:', e);
        res.status(500).json({ error: 'Error eliminando gasto: ' + e.message });
    }
});

// ============ BACKUPS ROUTES ============

app.get('/api/backups', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const users = await db.collection('users').find({}).toArray();
        const clientes = await db.collection('clientes').find({}).toArray();
        const gastos = await db.collection('gastos').find({}).toArray();
        
        const backups = [{
            id: 'current',
            fecha: new Date().toISOString(),
            tipo: 'actual',
            usuarios: users.length,
            clientes: clientes.length,
            gastos: gastos.length
        }];
        
        res.json(backups);
    } catch (e) {
        console.error('Error obteniendo backups:', e);
        res.status(500).json({ error: 'Error obteniendo backups: ' + e.message });
    }
});

app.get('/api/backup/download', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const users = await db.collection('users').find({}).toArray();
        const clientes = await db.collection('clientes').find({}).toArray();
        const gastos = await db.collection('gastos').find({}).toArray();
        
        const backup = {
            fecha: new Date().toISOString(),
            users: users.map(u => ({ ...u, id: u._id })),
            clientes: clientes.map(c => ({ ...c, id: c._id })),
            gastos: gastos.map(g => ({ ...g, id: g._id }))
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=backup-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.json`);
        res.json(backup);
    } catch (e) {
        console.error('Error descargando backup:', e);
        res.status(500).json({ error: 'Error descargando backup: ' + e.message });
    }
});

app.post('/api/backup/restore', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { users, clientes, gastos } = req.body;
        
        if (clientes && clientes.length > 0) {
            await db.collection('clientes').deleteMany({});
            const clientesLimpios = clientes.map(c => {
                const { _id, id, ...resto } = c;
                return resto;
            });
            await db.collection('clientes').insertMany(clientesLimpios);
        }
        
        if (gastos && gastos.length > 0) {
            await db.collection('gastos').deleteMany({});
            const gastosLimpios = gastos.map(g => {
                const { _id, id, ...resto } = g;
                return resto;
            });
            await db.collection('gastos').insertMany(gastosLimpios);
        }
        
        res.json({ success: true });
    } catch (e) {
        console.error('Error restaurando backup:', e);
        res.status(500).json({ error: 'Error restaurando backup: ' + e.message });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({ 
        message: 'FinanGest Backend API', 
        status: 'online',
        timestamp: new Date().toISOString(),
        mongoUri: process.env.MONGODB_URI ? 'configured' : 'missing'
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Backend funcionando correctamente',
        env: {
            mongoUri: process.env.MONGODB_URI ? 'configured' : 'missing',
            emailUser: process.env.EMAIL_USER ? 'configured' : 'missing',
            nodeEnv: process.env.NODE_ENV || 'development'
        }
    });
});

// Server time endpoint
app.get('/api/server-time', (req, res) => {
    const { timezone } = req.query;
    try {
        const now = new Date();
        res.json({
            success: true,
            serverTime: now.toISOString(),
            timestamp: now.getTime(),
            timezone: timezone || 'UTC'
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Heartbeat endpoint
app.post('/api/heartbeat', async (req, res) => {
    try {
        const { userId } = req.body;
        if (userId) {
            const db = await connectToDatabase();
            await db.collection('heartbeats').updateOne(
                { userId },
                { 
                    $set: { 
                        lastSeen: new Date(),
                        timestamp: Date.now()
                    }
                },
                { upsert: true }
            );
        }
        res.json({ success: true, timestamp: Date.now() });
    } catch (e) {
        console.error('Error en heartbeat:', e);
        res.json({ success: true }); // No fallar por heartbeat
    }
});

// Sessions endpoints (simplified)
app.get('/api/sessions/:userId', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const sessions = await db.collection('sessions').find({ 
            userId: req.params.userId 
        }).toArray();
        res.json({ success: true, sessions });
    } catch (e) {
        console.error('Error obteniendo sesiones:', e);
        res.json({ success: true, sessions: [] });
    }
});

app.post('/api/sessions/:sessionId/close', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('sessions').deleteOne({ 
            sessionId: req.params.sessionId 
        });
        res.json({ success: true });
    } catch (e) {
        console.error('Error cerrando sesión:', e);
        res.json({ success: true });
    }
});

app.post('/api/sessions/:userId/close-all', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('sessions').deleteMany({ 
            userId: req.params.userId 
        });
        res.json({ success: true });
    } catch (e) {
        console.error('Error cerrando todas las sesiones:', e);
        res.json({ success: true });
    }
});

app.post('/api/sessions/admin/close-all-users', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('sessions').deleteMany({});
        res.json({ success: true });
    } catch (e) {
        console.error('Error cerrando sesiones de usuarios:', e);
        res.json({ success: true });
    }
});

app.delete('/api/sessions/user/:userId', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('sessions').deleteMany({ 
            userId: req.params.userId 
        });
        res.json({ success: true });
    } catch (e) {
        console.error('Error eliminando sesiones de usuario:', e);
        res.json({ success: true });
    }
});

// ============ ESTADÍSTICAS DEL SERVIDOR (ADMIN) ============
app.get('/api/server-stats', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        
        // Estadísticas de MongoDB
        const users = await db.collection('users').countDocuments();
        const clientes = await db.collection('clientes').countDocuments();
        const gastos = await db.collection('gastos').countDocuments();
        
        // Calcular tamaño aproximado de la base de datos
        const stats = await db.stats();
        
        res.json({
            success: true,
            server: {
                uptime: Math.floor(uptime),
                uptimeFormatted: formatUptime(uptime),
                memoryUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
                memoryTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
                memoryLimit: 512, // Vercel serverless limit
                platform: process.platform,
                nodeVersion: process.version
            },
            mongodb: {
                users,
                clientes,
                gastos,
                totalDocuments: users + clientes + gastos,
                dataSize: Math.round(stats.dataSize / 1024 / 1024), // MB
                storageSize: Math.round(stats.storageSize / 1024 / 1024), // MB
                storageLimit: 512, // MongoDB Atlas free tier
                connected: true
            }
        });
    } catch (e) {
        console.error('Error obteniendo estadísticas del servidor:', e);
        res.status(500).json({ success: false, error: e.message });
    }
});

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
}

const PORT = process.env.PORT || 3000;

// Solo para desarrollo local
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 FinanGest Server corriendo en puerto ${PORT}`);
    });
}

module.exports = app;
