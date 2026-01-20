# 🚀 CONFIGURACIÓN COMPLETA - FinanGest

## ⚠️ IMPORTANTE: Sigue estos pasos EN ORDEN

---

## 📋 PASO 0: Requisitos Previos

### Instalar Flutter
```bash
# Descargar Flutter desde: https://flutter.dev/docs/get-started/install
# Verificar instalación:
flutter doctor

# Debe mostrar:
# ✓ Flutter (Channel stable, 3.x.x)
# ✓ Android toolchain
# ✓ Chrome (opcional)
# ✓ Android Studio / VS Code
```

### Instalar Node.js
```bash
# Descargar desde: https://nodejs.org/ (versión LTS)
# Verificar:
node --version  # Debe ser v18 o superior
npm --version
```

### Instalar Firebase CLI
```bash
npm install -g firebase-tools

# Verificar:
firebase --version

# Login:
firebase login
```

---

## 🔥 PASO 1: Crear Proyecto en Firebase

### 1.1 Ir a Firebase Console
- Abrir: https://console.firebase.google.com/
- Click en "Agregar proyecto"
- Nombre: **FinanGest** (o el que prefieras)
- Habilitar Google Analytics: **SÍ** (recomendado)
- Click "Crear proyecto"
- Esperar 30 segundos...
- Click "Continuar"

### 1.2 Agregar App Android
1. En el proyecto, click en el ícono de Android
2. Nombre del paquete: `com.tuempresa.finangest`
3. Apodo de la app: `FinanGest`
4. SHA-1: (opcional por ahora, lo agregaremos después)
5. Click "Registrar app"
6. **DESCARGAR** `google-services.json`
7. Click "Siguiente" → "Siguiente" → "Continuar a la consola"

### 1.3 Agregar App iOS (opcional)
1. Click en el ícono de iOS
2. ID del paquete: `com.tuempresa.finangest`
3. Apodo: `FinanGest`
4. Click "Registrar app"
5. **DESCARGAR** `GoogleService-Info.plist`
6. Click "Siguiente" → "Siguiente" → "Continuar a la consola"

---

## 🔐 PASO 2: Habilitar Servicios de Firebase

### 2.1 Authentication
1. En el menú lateral → **Authentication**
2. Click "Comenzar"
3. Pestaña "Sign-in method"
4. Habilitar **"Correo electrónico/contraseña"**
   - Click en "Correo electrónico/contraseña"
   - Activar el switch
   - Click "Guardar"
5. Habilitar **"Google"**
   - Click en "Google"
   - Activar el switch
   - Email de asistencia: tu-email@gmail.com
   - Click "Guardar"

### 2.2 Firestore Database
1. En el menú lateral → **Firestore Database**
2. Click "Crear base de datos"
3. Modo: **"Producción"** (las rules las subiremos después)
4. Ubicación: Selecciona la más cercana (ej: `southamerica-east1` para Brasil)
5. Click "Habilitar"
6. Esperar 1-2 minutos...

### 2.3 Cloud Functions
1. En el menú lateral → **Functions**
2. Click "Comenzar"
3. **IMPORTANTE**: Necesitas actualizar a plan **Blaze (pago por uso)**
   - Click "Actualizar proyecto"
   - Agregar método de pago (tarjeta)
   - No te preocupes: Firebase tiene cuota gratuita generosa
   - Límite mensual gratuito:
     - 2M invocaciones
     - 400K GB-segundos
     - 200K CPU-segundos
   - Solo pagas si excedes (muy difícil en desarrollo)

### 2.4 Storage
1. En el menú lateral → **Storage**
2. Click "Comenzar"
3. Modo: **"Producción"**
4. Ubicación: La misma que Firestore
5. Click "Listo"

### 2.5 App Check
1. En el menú lateral → **App Check**
2. Click "Comenzar"
3. Registrar app Android:
   - Proveedor: **Play Integrity**
   - Click "Guardar"
4. Registrar app iOS (si la tienes):
   - Proveedor: **App Attest**
   - Click "Guardar"

---

## 📱 PASO 3: Configurar el Proyecto Flutter

### 3.1 Copiar archivos de Firebase

#### Android:
```bash
# Copiar google-services.json que descargaste en el paso 1.2
# A la carpeta:
finangest-flutter/android/app/google-services.json
```

#### iOS (si aplica):
```bash
# Copiar GoogleService-Info.plist que descargaste en el paso 1.3
# A la carpeta:
finangest-flutter/ios/Runner/GoogleService-Info.plist
```

### 3.2 Instalar FlutterFire CLI
```bash
# Instalar globalmente
dart pub global activate flutterfire_cli

# Verificar
flutterfire --version
```

### 3.3 Configurar Firebase en Flutter
```bash
# Ir a la carpeta del proyecto
cd finangest-flutter

# Ejecutar configuración automática
flutterfire configure

# Seleccionar:
# 1. Tu proyecto Firebase (FinanGest)
# 2. Plataformas: Android, iOS (las que tengas)
# 3. Confirmar

# Esto creará/actualizará:
# - lib/firebase_options.dart
# - android/app/google-services.json
# - ios/Runner/GoogleService-Info.plist
```

### 3.4 Instalar dependencias de Flutter
```bash
flutter pub get

# Debe descargar todas las dependencias sin errores
```

---

## ⚙️ PASO 4: Configurar Cloud Functions

### 4.1 Inicializar Firebase en el proyecto
```bash
# Desde la carpeta finangest-flutter/
firebase init

# Seleccionar (con ESPACIO):
# ✓ Firestore
# ✓ Functions
# ✓ Storage

# Preguntas:
# - Use existing project → Seleccionar tu proyecto
# - Firestore rules file → firestore.rules (ya existe)
# - Firestore indexes file → firestore.indexes.json (crear)
# - Functions language → JavaScript
# - ESLint → No
# - Install dependencies → Yes
# - Storage rules file → storage.rules (crear)
```

### 4.2 Configurar Admin y Zona Horaria

Editar `functions/index.js` líneas 10-11:

```javascript
// CAMBIAR ESTAS LÍNEAS:
const TIMEZONE = 'America/Fortaleza'; // Tu zona horaria
const ADMIN_WHITELIST = ['tu-email@gmail.com']; // TU EMAIL REAL

// Zonas horarias comunes:
// Brasil: 'America/Fortaleza', 'America/Sao_Paulo'
// Colombia: 'America/Bogota'
// México: 'America/Mexico_City'
// Argentina: 'America/Argentina/Buenos_Aires'
// Chile: 'America/Santiago'
```

### 4.3 Instalar dependencias de Functions
```bash
cd functions
npm install
cd ..
```

---

## 🚀 PASO 5: Desplegar a Firebase

### 5.1 Desplegar Firestore Rules
```bash
firebase deploy --only firestore:rules

# Debe mostrar:
# ✓ Deploy complete!
```

### 5.2 Desplegar Cloud Functions
```bash
firebase deploy --only functions

# Esto toma 3-5 minutos la primera vez
# Debe mostrar:
# ✓ functions[onUserCreate]: Successful create operation.
# ✓ functions[createWallet]: Successful create operation.
# ... (15+ funciones)
# ✓ Deploy complete!
```

### 5.3 Desplegar Storage Rules
```bash
firebase deploy --only storage

# Debe mostrar:
# ✓ Deploy complete!
```

---

## 🔧 PASO 6: Configuración Final

### 6.1 Obtener SHA-1 para Google Sign-In (Android)

```bash
# En Windows:
cd android
gradlew signingReport

# En Mac/Linux:
cd android
./gradlew signingReport

# Buscar en la salida:
# SHA1: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX
# Copiar ese valor
```

Agregar SHA-1 a Firebase:
1. Firebase Console → Configuración del proyecto (⚙️)
2. Pestaña "General"
3. Scroll hasta "Tus apps"
4. Click en tu app Android
5. Scroll hasta "Huellas digitales de certificado SHA"
6. Click "Agregar huella digital"
7. Pegar el SHA-1
8. Click "Guardar"

### 6.2 Descargar nuevo google-services.json
1. En la misma pantalla, click "Descargar google-services.json"
2. Reemplazar el archivo en `android/app/google-services.json`

---

## ✅ PASO 7: Ejecutar la App

### 7.1 Conectar dispositivo o emulador

#### Opción A: Dispositivo físico
```bash
# Habilitar "Depuración USB" en tu Android
# Conectar con cable USB
# Verificar:
flutter devices

# Debe mostrar tu dispositivo
```

#### Opción B: Emulador Android
```bash
# Abrir Android Studio
# Tools → Device Manager
# Crear/Iniciar un emulador
# Verificar:
flutter devices
```

### 7.2 Ejecutar la app
```bash
# Desde finangest-flutter/
flutter run

# O para modo release:
flutter run --release

# La app se instalará y abrirá automáticamente
```

---

## 🎯 PASO 8: Primer Uso

### 8.1 Crear tu cuenta de Admin
1. La app abrirá en la pantalla de Login
2. Click en "Continuar con Google"
3. Selecciona tu cuenta (la que pusiste en ADMIN_WHITELIST)
4. Acepta permisos
5. ¡Listo! Eres admin automáticamente

### 8.2 Crear tu primera cartera
1. En el Home, verás "Selecciona una Cartera"
2. Como no hay carteras, ve a:
   - Menú (👤) → Configuración
   - Administración → Gestionar Carteras
   - Click en "+" o "Crear Cartera"
3. Nombre: "Cartera Principal"
4. Contraseña: "admin123" (cámbiala después)
5. Confirmar contraseña
6. Click "Crear"

### 8.3 Desbloquear cartera
1. Volver al Home
2. Seleccionar "Cartera Principal"
3. Ingresar contraseña: "admin123"
4. Click "Desbloquear"
5. ¡Listo! Ya puedes usar la app

### 8.4 Crear tu primer cliente
1. Ir a pestaña "Clientes"
2. Click en botón flotante "+" (abajo derecha)
3. Llenar datos:
   - Nombre: Juan Pérez
   - CPF: 12345678901
   - Teléfono: +55 11 98765-4321
   - Ubicación: São Paulo, SP
   - Tipo de negocio: Comercio
   - Microseguro: 100
4. Click "Guardar"

### 8.5 Crear tu primer préstamo
1. Ir a pestaña "Préstamos"
2. Click en botón flotante "+"
3. Seleccionar cliente: Juan Pérez
4. Monto total: 1000
5. Número de cuotas: 10
6. Frecuencia: Semanal
7. Primer vencimiento: Seleccionar fecha
8. Click "Crear"
9. ¡El sistema crea automáticamente las 10 cuotas!

### 8.6 Registrar tu primer pago
1. En "Préstamos", ver el préstamo de Juan Pérez
2. Click en el préstamo
3. Ver lista de cuotas
4. Click en "Pagar" en la primera cuota
5. Confirmar
6. ¡La cuota se marca verde 🟩!
7. El préstamo se actualiza automáticamente

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "App Check token is invalid"
```bash
# Solución:
# 1. Verificar que App Check esté habilitado en Firebase Console
# 2. Verificar SHA-1 agregado correctamente
# 3. Descargar nuevo google-services.json
# 4. Limpiar y reconstruir:
flutter clean
flutter pub get
flutter run
```

### Error: "Permission denied" en Firestore
```bash
# Solución:
# 1. Verificar que las rules estén desplegadas:
firebase deploy --only firestore:rules

# 2. Verificar en Firebase Console → Firestore → Rules
# Debe mostrar las rules complejas, no las por defecto
```

### Error: Functions no se ejecutan
```bash
# Solución:
# 1. Verificar que estén desplegadas:
firebase functions:list

# 2. Ver logs:
firebase functions:log

# 3. Verificar plan Blaze activo en Firebase Console
```

### Error: "Google Sign-In failed"
```bash
# Solución:
# 1. Verificar SHA-1 agregado
# 2. Descargar nuevo google-services.json
# 3. Verificar que Google esté habilitado en Authentication
# 4. Limpiar y reconstruir
```

### La app no compila
```bash
# Solución:
flutter clean
flutter pub get
cd android && ./gradlew clean && cd ..
flutter run
```

---

## 📊 VERIFICAR QUE TODO FUNCIONA

### Checklist Final:
- [ ] La app abre sin errores
- [ ] Puedo hacer login con Google
- [ ] Soy admin (veo opciones de admin en Configuración)
- [ ] Puedo crear una cartera
- [ ] Puedo desbloquear la cartera con contraseña
- [ ] Puedo crear un cliente
- [ ] Puedo crear un préstamo
- [ ] Las cuotas se crean automáticamente
- [ ] Puedo pagar una cuota
- [ ] La cuota se marca verde 🟩
- [ ] El préstamo se actualiza
- [ ] Veo estadísticas en el Dashboard
- [ ] El sistema muestra "Abierto" entre 06:00-00:00

Si todos los checks están ✓, ¡tu app está 100% funcional!

---

## 🎉 ¡LISTO!

Tu app FinanGest está completamente configurada y funcional.

### Próximos pasos:
1. Cambiar contraseñas de prueba
2. Crear más usuarios (workers)
3. Asignar carteras a workers
4. Empezar a usar en producción

### Recursos:
- Firebase Console: https://console.firebase.google.com/
- Logs de Functions: `firebase functions:log`
- Crashlytics: Firebase Console → Crashlytics
- Analytics: Firebase Console → Analytics

---

## 📞 Soporte

Si algo no funciona:
1. Revisar este archivo paso por paso
2. Ver logs: `firebase functions:log`
3. Ver logs de Flutter: `flutter logs`
4. Verificar Firebase Console → Firestore → Data
5. Verificar Firebase Console → Functions → Logs

**¡Disfruta tu app FinanGest!** 🚀
