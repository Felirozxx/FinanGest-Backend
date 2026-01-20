const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 8080;

// Deshabilitar caché
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Servir archivos estáticos
app.use(express.static('public', {
  etag: false,
  lastModified: false,
  maxAge: 0
}));

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  ✅ Servidor iniciado en puerto', PORT);
  console.log('═══════════════════════════════════════════════════════\n');
  
  // Iniciar ngrok para crear túnel público
  console.log('  🌐 Creando túnel público con ngrok...\n');
  
  exec(`ngrok http ${PORT} --log=stdout`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error al iniciar ngrok:', error);
      return;
    }
  });
  
  // Esperar 3 segundos y obtener la URL pública
  setTimeout(() => {
    exec('curl http://localhost:4040/api/tunnels', (error, stdout) => {
      if (!error && stdout) {
        try {
          const data = JSON.parse(stdout);
          if (data.tunnels && data.tunnels.length > 0) {
            const publicUrl = data.tunnels[0].public_url;
            console.log('═══════════════════════════════════════════════════════');
            console.log('  🎉 ¡TU APP ESTÁ ONLINE!');
            console.log('═══════════════════════════════════════════════════════');
            console.log('');
            console.log('  📱 LINK PÚBLICO (compártelo con quien quieras):');
            console.log('     ' + publicUrl);
            console.log('');
            console.log('  💻 Este link funciona desde CUALQUIER dispositivo');
            console.log('     en CUALQUIER parte del mundo');
            console.log('');
            console.log('═══════════════════════════════════════════════════════');
            console.log('  ⚠️  IMPORTANTE: No cierres esta ventana');
            console.log('      El link dejará de funcionar si cierras el programa');
            console.log('═══════════════════════════════════════════════════════\n');
          }
        } catch (e) {
          console.log('  ⏳ Obteniendo URL pública...');
        }
      }
    });
  }, 3000);
});
