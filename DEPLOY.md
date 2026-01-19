# 🚀 Guía de Despliegue FinanGest

## 📋 Requisitos Previos
- Cuenta en Render.com (gratis)
- Cuenta en Netlify.com (gratis)
- MongoDB Atlas configurado

## 🔧 Paso 1: Desplegar Backend en Render

1. Ve a https://render.com y crea una cuenta (si no tienes)
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub o sube el código
4. Configuración:
   - **Name:** finangest-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server-mongodb.js`
   - **Plan:** Free

5. Agregar Variables de Entorno (Environment Variables):
   ```
   MONGODB_URI=mongodb+srv://Felirozxx:Pipe16137356@cluster0.luvtqa7.mongodb.net/finangest?retryWrites=true&w=majority
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_app_password
   PORT=3000
   ```

6. Click en "Create Web Service"
7. Espera a que se despliegue (5-10 minutos)
8. **COPIA LA URL** que te da Render (ejemplo: https://finangest-backend-xxxx.onrender.com)

## 🌐 Paso 2: Actualizar Frontend

1. Abre el archivo `public/finangest.html`
2. Busca la línea: `const API_URL = 'http://localhost:3000';`
3. Reemplázala con tu URL de Render: `const API_URL = 'https://finangest-backend-xxxx.onrender.com';`
4. Guarda el archivo

## ☁️ Paso 3: Desplegar Frontend en Netlify

### Opción A: Drag & Drop (Más fácil)
1. Ve a https://app.netlify.com
2. Arrastra la carpeta `public` a la zona de "Drop"
3. Listo! Netlify te dará una URL

### Opción B: Desde Git
1. Sube tu código a GitHub
2. En Netlify: "Add new site" → "Import from Git"
3. Selecciona tu repositorio
4. Configuración:
   - **Build command:** (dejar vacío)
   - **Publish directory:** `public`
5. Click en "Deploy"

## ✅ Paso 4: Verificar

1. Abre la URL de Netlify
2. Intenta hacer login con: fzuluaga548@gmail.com / Pipe16137356
3. Crea una cartera de prueba

## 🔄 Actualizar después

### Backend:
- Render se actualiza automáticamente si conectaste GitHub
- O sube los archivos nuevamente

### Frontend:
- Netlify: arrastra la carpeta `public` de nuevo
- O usa Git para actualizar automáticamente

## ⚠️ Notas Importantes

- Render free tier: el servidor se duerme después de 15 minutos sin uso
- Primera petición después de dormir puede tardar 30-60 segundos
- MongoDB Atlas free tier: 512MB de almacenamiento
- Netlify free tier: 100GB de ancho de banda/mes

## 🆘 Problemas Comunes

### "Error de conexión" al crear cartera
- Verifica que la URL del backend en `finangest.html` sea correcta
- Verifica que el backend esté corriendo en Render

### Backend no inicia en Render
- Verifica las variables de entorno
- Revisa los logs en Render Dashboard

### No puedo hacer login
- Verifica que MongoDB URI sea correcta
- Ejecuta `node make-user-admin.js` localmente para crear admin
