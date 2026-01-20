const express = require('express');
const path = require('path');
const app = express();

// Deshabilitar caché completamente
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

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  ✅ FinanGest está ONLINE');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('  📱 Desde tu CELULAR abre:');
  console.log('     http://10.215.172.146:8080');
  console.log('');
  console.log('  💻 Desde tu PC abre:');
  console.log('     http://localhost:8080');
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Presiona Ctrl+C para detener el servidor');
  console.log('═══════════════════════════════════════════════════════\n');
});
