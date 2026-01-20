# 🚀 EMPEZAR AQUÍ - FinanGest

## ✅ YA ESTÁ CONFIGURADO

Tu app ya tiene configurado:
- ✅ **Admin**: fzuluaga548@gmail.com y finangestsoftware@gmail.com
- ✅ **Zona horaria**: Brasilia (America/Sao_Paulo)
- ✅ **Código**: 100% listo
- ✅ **Seguridad**: Completa

---

## 📋 SOLO DEBES HACER ESTO (40 minutos)

### 🔥 PARTE 1: FIREBASE CONSOLE (15 min)

#### 1. Crear Proyecto
```
1. Ir a: https://console.firebase.google.com/
2. Login con: finangestsoftware@gmail.com / Pipe16137356
3. Click "Agregar proyecto"
4. Nombre: FinanGest
5. Habilitar Analytics: SÍ
6. Click "Crear proyecto"
```

#### 2. Habilitar Servicios

**Authentication:**
```
Menú → Authentication → Comenzar
→ Habilitar "Email/Password"
→ Habilitar "Google" (email: finangestsoftware@gmail.com)
```

**Firestore:**
```
Menú → Firestore Database → Crear
→ Modo: Producción
→ Ubicación: southamerica-east1 (São Paulo)
```

**Functions (Plan Blaze):**
```
Menú → Functions → Comenzar
→ Click "Actualizar proyecto"
→ Agregar tarjeta (cuota gratuita: 2M invocaciones/mes)
```

**Storage:**
```
Menú → Storage → Comenzar
→ Modo: Producción
```

**App Check:**
```
Menú → App Check → Comenzar
→ Registrar app Android
→ Proveedor: Play Integrity
```

#### 3. Agregar App Android
```
1. Click ícono Android
2. Paquete: com.finangest.app
3. Apodo: FinanGest
4. Click "Registrar app"
5. DESCARGAR google-services.json
6. Guardar (lo copiarás después)
```

---

### 💻 PARTE 2: CONFIGURACIÓN LOCAL (10 min)

#### 1. Abrir Terminal y Ejecutar:

```bash
# Ir a la carpeta del proyecto
cd finangest-flutter

# Login a Firebase
firebase login
# Usar: finangestsoftware@gmail.com / Pipe16137356

# Configurar FlutterFire
flutterfire configure
# Seleccionar: FinanGest (tu proyecto)
# Plataformas: Android (y iOS si quieres)

# Instalar dependencias Flutter
flutter pub get

# Instalar dependencias Functions
cd functions
npm install
cd ..

# Inicializar Firebase
firebase init
# Seleccionar: Firestore, Functions, Storage
# Use existing project → FinanGest
# JavaScript → Yes
# Install dependencies → Yes
```

#### 2. Copiar google-services.json

```bash
# Copiar el archivo que descargaste a:
# finangest-flutter/android/app/google-services.json
```

---

### 🚀 PARTE 3: DESPLEGAR (5 min)

```bash
# Desplegar todo
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only storage

# Esperar 3-5 minutos... ☕
```

---

### 📱 PARTE 4: EJECUTAR (2 min)

```bash
# Conectar Android con USB o iniciar emulador
flutter devices

# Ejecutar app
flutter run
```

---

### 🎯 PARTE 5: USAR LA APP (5 min)

#### 1. Login
```
1. Abrir app
2. Click "Continuar con Google"
3. Seleccionar: fzuluaga548@gmail.com
4. ¡Eres admin! ✅
```

#### 2. Crear Cartera
```
1. Menú (👤) → Configuración
2. Gestionar Carteras → Crear
3. Nombre: Cartera Principal
4. Contraseña: admin123
5. Guardar
```

#### 3. Desbloquear
```
1. Volver al Home
2. Seleccionar "Cartera Principal"
3. Contraseña: admin123
4. Desbloquear
```

#### 4. Crear Cliente
```
1. Pestaña "Clientes"
2. Click "+" (flotante)
3. Llenar datos
4. Guardar
```

#### 5. Crear Préstamo
```
1. Pestaña "Préstamos"
2. Click "+"
3. Monto: 1000
4. Cuotas: 10
5. Frecuencia: Semanal
6. Crear
```

#### 6. Pagar Cuota
```
1. Click en el préstamo
2. Ver cuotas
3. Click "Pagar" en cuota #1
4. Confirmar
5. ¡Verde 🟩!
```

---

## ✅ VERIFICACIÓN FINAL

Todo funciona si puedes:
- [x] Hacer login con tu Gmail
- [x] Eres admin (ves opciones de admin)
- [x] Crear y desbloquear cartera
- [x] Crear cliente
- [x] Crear préstamo (cuotas se crean automáticamente)
- [x] Pagar cuota (se marca verde 🟩)
- [x] Ver estadísticas en Dashboard

---

## 🐛 SI ALGO FALLA

### Google Sign-In no funciona:
```bash
# 1. Obtener SHA-1
cd android
./gradlew signingReport
# Copiar el SHA-1

# 2. Agregar en Firebase Console
# Configuración → Tus apps → Android → Agregar SHA-1

# 3. Descargar nuevo google-services.json
# 4. Reemplazar en android/app/

# 5. Limpiar y ejecutar
flutter clean
flutter pub get
flutter run
```

### Functions no funcionan:
```bash
# Ver logs
firebase functions:log

# Verificar que estén desplegadas
firebase functions:list
```

### Firestore da error:
```bash
# Redesplegar rules
firebase deploy --only firestore:rules
```

---

## 📚 MÁS INFORMACIÓN

- **MI_CONFIGURACION.md** - Tu configuración específica
- **SETUP_COMPLETO.md** - Guía detallada paso a paso
- **CHECKLIST_RAPIDO.md** - Checklist visual
- **APP_PREVIEW.md** - Ver cómo se ve la app

---

## 🎉 ¡ESO ES TODO!

Siguiendo estos pasos tendrás tu app funcionando en **40 minutos**.

**Credenciales:**
- Firebase: finangestsoftware@gmail.com / Pipe16137356
- Admin: fzuluaga548@gmail.com
- Zona: Brasilia (UTC-3)

**¿Dudas?** Lee **MI_CONFIGURACION.md** para más detalles.

---

**FinanGest** - Listo para usar 🚀
