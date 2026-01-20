const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde public
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 FinanGest Landing Page está corriendo!               ║
║                                                            ║
║   📱 Accede desde tu celular:                             ║
║   http://192.168.1.X:8080                                 ║
║                                                            ║
║   💻 Accede desde tu PC:                                  ║
║   http://localhost:8080                                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
  
  // Obtener IP local
  const os = require('os');
  const interfaces = os.networkInterfaces();
  console.log('\n🌐 Tus IPs locales:');
  Object.keys(interfaces).forEach(name => {
    interfaces[name].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`   http://${iface.address}:8080`);
      }
    });
  });
  console.log('\n');
});
