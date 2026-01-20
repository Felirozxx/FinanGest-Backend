# 🗄️ Guía Completa: Configurar MongoDB Atlas para FinanGest

## 📋 Problema Actual
Al crear una "Nueva Cartera" aparece: **"Error de conexión"**

### Causas Comunes:
1. ❌ IP de Vercel no autorizada en MongoDB Atlas
2. ❌ Variable `MONGODB_URI` no configurada en Vercel
3. ❌ Cadena de conexión incorrecta

---

## ✅ PASO 1: Acceder a MongoDB Atlas

### 1.1 Iniciar Sesión
1. Ve a: https://cloud.mongodb.com
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto (o crea uno nuevo)

### 1.2 Ubicar tu Cluster
- Verás tu cluster en el dashboard principal
- Generalmente se llama `Cluster0` o similar

---

## ✅ PASO 2: Habilitar Acceso desde Cualquier IP (0.0.0.0/0)

### 2.1 Ir a Network Access
1. En el menú lateral izquierdo, click en **"Network Access"**
2. O busca: **Security → Network Access**

### 2.2 Agregar IP Address
1. Click en el botón verde **"+ ADD IP ADDRESS"**
2. En el modal que aparece:
   - Click en **"ALLOW ACCESS FROM ANYWHERE"**
   - Esto automáticamente pone: `0.0.0.0/0`
3. (Opcional) Agrega un comentario: `Vercel Deployment`
4. Click en **"Confirm"**

### 2.3 Verificar
- Deberías ver en la lista:
  ```
  0.0.0.0/0 (includes your current IP address)
  ```
- Estado: **Active** (con punto verde)

---

## ✅ PASO 3: Obtener la Cadena de Conexión (MONGODB_URI)

### 3.1 Ir a Database
1. En el menú lateral, click en **"Database"**
2. Verás tu cluster listado

### 3.2 Conectar
1. Click en el botón **"Connect"** de tu cluster
2. Selecciona **"Connect your application"**

### 3.3 Copiar Connection String
1. Selecciona:
   - **Driver:** Node.js
   - **Version:** 4.1 or later
2. Copia la cadena que aparece, se ve así:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 3.4 Reemplazar Valores
Reemplaza en la cadena:
- `<username>` → Tu usuario de MongoDB
- `<password>` → Tu contraseña de MongoDB (sin < >)

**Ejemplo:**
```
mongodb+srv://felirozxx:MiPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

**⚠️ IMPORTANTE:** 
- NO uses `<` ni `>` en la cadena final
- Si tu contraseña tiene caracteres especiales (@, #, $, etc.), debes codificarlos:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - Usa: https://www.urlencoder.org/

---

## ✅ PASO 4: Configurar Variable en Vercel

### 4.1 Ir a Vercel Dashboard
1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto **"finan-gest"**

### 4.2 Ir a Settings
1. Click en la pestaña **"Settings"**
2. En el menú lateral, click en **"Environment Variables"**

### 4.3 Agregar MONGODB_URI
1. Click en **"Add New"**
2. Llena los campos:
   - **Name:** `MONGODB_URI`
   - **Value:** Pega tu cadena de conexión completa
   - **Environment:** Selecciona **Production**, **Preview**, y **Development**
3. Click en **"Save"**

### 4.4 Ejemplo de Configuración
```
Name: MONGODB_URI
Value: mongodb+srv://felirozxx:MiPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
Environments: ✓ Production ✓ Preview ✓ Development
```

---

## ✅ PASO 5: Redesplegar en Vercel

### Opción A: Desde Vercel Dashboard
1. Ve a la pestaña **"Deployments"**
2. Click en el deployment más reciente
3. Click en el menú **"..."** (tres puntos)
4. Selecciona **"Redeploy"**
5. Confirma con **"Redeploy"**

### Opción B: Desde GitHub (Recomendado)
1. Haz cualquier cambio pequeño en tu repositorio
2. O simplemente haz push de los cambios que ya hicimos:
   ```bash
   git add .
   git commit -m "fix: configurar MongoDB y mejorar manejo de errores"
   git push origin main
   ```
3. Vercel desplegará automáticamente

---

## ✅ PASO 6: Verificar que Funciona

### 6.1 Esperar el Despliegue
- Espera 1-3 minutos hasta que Vercel termine
- Verás "Ready" cuando esté listo

### 6.2 Probar la Aplicación
1. Ve a: https://finan-gest.vercel.app
2. Inicia sesión con tu cuenta
3. Intenta crear una **"Nueva Cartera"**
4. Debería funcionar sin errores

### 6.3 Verificar Logs (Si hay problemas)
1. En Vercel, ve a **"Deployments"**
2. Click en el deployment actual
3. Click en **"Functions"**
4. Busca errores relacionados con MongoDB

---

## 🔍 Solución de Problemas

### Error: "Authentication failed"
**Causa:** Usuario o contraseña incorrectos
**Solución:**
1. Ve a MongoDB Atlas → Security → Database Access
2. Verifica tu usuario y contraseña
3. Si es necesario, crea un nuevo usuario:
   - Click en **"+ ADD NEW DATABASE USER"**
   - Username: `finangest-user`
   - Password: Genera una segura (sin caracteres especiales)
   - Database User Privileges: **Read and write to any database**
   - Click **"Add User"**
4. Actualiza `MONGODB_URI` en Vercel con las nuevas credenciales

### Error: "Connection timeout"
**Causa:** IP no autorizada
**Solución:**
1. Verifica que `0.0.0.0/0` esté en Network Access
2. Asegúrate de que esté **Active** (punto verde)
3. Espera 1-2 minutos para que se propague

### Error: "MONGODB_URI is not defined"
**Causa:** Variable no configurada en Vercel
**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que `MONGODB_URI` exista
3. Asegúrate de que esté marcada para **Production**
4. Redesplega la aplicación

### Error: "Invalid connection string"
**Causa:** Formato incorrecto de la URI
**Solución:**
1. Verifica que la cadena empiece con `mongodb+srv://`
2. No debe tener espacios
3. Reemplaza `<username>` y `<password>` con valores reales
4. Codifica caracteres especiales en la contraseña

---

## 📊 Verificar Conexión desde Vercel

### Endpoint de Prueba
Visita: https://finan-gest.vercel.app/api/test

Deberías ver:
```json
{
  "success": true,
  "message": "Backend funcionando correctamente",
  "env": {
    "mongoUri": "configured",
    "emailUser": "configured",
    "nodeEnv": "production"
  }
}
```

Si `mongoUri` dice `"missing"`, la variable no está configurada.

---

## 🔐 Seguridad: Mejores Prácticas

### ✅ Recomendaciones:
1. **Usa contraseñas fuertes** para MongoDB
2. **Habilita 0.0.0.0/0** solo si usas servicios serverless (Vercel, Netlify)
3. **Nunca compartas** tu `MONGODB_URI` públicamente
4. **Usa variables de entorno** siempre (nunca hardcodees la URI)
5. **Habilita autenticación** en MongoDB Atlas

### ⚠️ Si prefieres más seguridad:
En lugar de `0.0.0.0/0`, puedes agregar IPs específicas de Vercel:
- Ve a: https://vercel.com/docs/concepts/functions/serverless-functions/regions
- Agrega cada IP de la región que uses
- **Nota:** Esto es más complejo y puede fallar si Vercel cambia IPs

---

## 📝 Checklist Final

Antes de continuar, verifica:

- [ ] Iniciaste sesión en MongoDB Atlas
- [ ] Agregaste `0.0.0.0/0` en Network Access
- [ ] Copiaste la cadena de conexión correctamente
- [ ] Reemplazaste `<username>` y `<password>`
- [ ] Agregaste `MONGODB_URI` en Vercel
- [ ] Seleccionaste Production, Preview y Development
- [ ] Guardaste la variable en Vercel
- [ ] Redesplegaste la aplicación
- [ ] Esperaste 1-3 minutos
- [ ] Probaste crear una cartera

---

## 🎉 ¡Listo!

Si seguiste todos los pasos, tu aplicación debería funcionar correctamente.

**Próximos pasos:**
1. Prueba crear una cartera
2. Agrega clientes
3. Registra gastos
4. Explora todas las funcionalidades

**¿Aún tienes problemas?**
- Revisa los logs en Vercel
- Verifica que MongoDB Atlas esté en plan gratuito (M0)
- Asegúrate de tener espacio disponible (512MB gratis)
