const fetch = require('node-fetch');

const API_URL = 'https://finangest-backend.vercel.app';

async function testLogin() {
    console.log('🔐 Probando login en el backend...');
    
    try {
        // Test login
        const loginRes = await fetch(API_URL + '/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'fzuluaga548@gmail.com',
                password: 'Pipe16137356'
            })
        });
        
        const loginData = await loginRes.json();
        console.log('📝 Respuesta de login:', loginData);
        
        if (loginData.success) {
            console.log('✅ Login exitoso');
            console.log('👤 Usuario:', loginData.user.nombre);
            
            // Test carteras
            const carterasRes = await fetch(API_URL + '/api/carteras/' + loginData.user.id);
            const carterasData = await carterasRes.json();
            console.log('📁 Carteras:', carterasData);
            
            // Test server time
            const timeRes = await fetch(API_URL + '/api/server-time');
            const timeData = await timeRes.json();
            console.log('⏰ Hora del servidor:', timeData);
            
        } else {
            console.log('❌ Login falló:', loginData.error);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testLogin();