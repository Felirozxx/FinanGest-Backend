# ✅ CHECKLIST RÁPIDO - FinanGest

## 📋 Antes de Empezar

```bash
# Verificar que tienes instalado:
flutter --version    # ✓ Flutter 3.0+
node --version       # ✓ Node.js 18+
firebase --version   # ✓ Firebase CLI
```

Si falta algo, instalar desde:
- Flutter: https://flutter.dev/docs/get-started/install
- Node.js: https://nodejs.org/
- Firebase CLI: `npm install -g firebase-tools`

---

## 🔥 FIREBASE CONSOLE (15 minutos)

### 1. Crear Proyecto
- [ ] Ir a https://console.firebase.google.com/
- [ ] Click "Agregar proyecto"
- [ ] Nombre: **FinanGest**
- [ ] Habilitar Analytics: **SÍ**
- [ ] Click "Crear proyecto"

### 2. Agregar App Android
- [ ] Click ícono Android
- [ ] Paquete: `com.tuempresa.finangest`
- [ ] Descargar `google-services.json`
- [ ] Copiar a: `finangest-flutter/android/app/`

### 3. Habilitar Authentication
- [ ] Menú → Authentication → Comenzar
- [ ] Habilitar "Email/Password"
- [ ] Habilitar "Google"

### 4. Crear Firestore Database
- [ ] Menú → Firestore Database → Crear
- [ ] Modo: **Producción**
- [ ] Ubicación: La más cercana

### 5. Actualizar a Plan Blaze
- [ ] Menú → Functions → Comenzar
- [ ] Click "Actualizar proyecto"
- [ ] Agregar tarjeta (no te preocupes, hay cuota gratuita)

### 6. Habilitar Storage
- [ ] Menú → Storage → Comenzar
- [ ] Modo: **Producción**

### 7. Configurar App Check
- [ ] Menú → App Check → Comenzar
- [ ] Registrar app Android
- [ ] Proveedor: **Play Integrity**

---

## 💻 CONFIGURACIÓN LOCAL (10 minutos)

### 1. Instalar FlutterFire CLI
```bash
dart pub global activate flutterfire_cli
```

### 2. Configurar Firebase
```bash
cd finangest-flutter
firebase login
flutterfire configure
# Seleccionar tu proyecto FinanGest
```

### 3. Instalar Dependencias
```bash
flutter pub get
cd functions && npm install && cd ..
```

### 4. Configurar Admin
Editar `functions/index.js` línea 11:
```javascript
const ADMIN_WHITELIST = ['TU-EMAIL@gmail.com']; // ← CAMBIAR AQUÍ
```

### 5. Configurar Zona Horaria
Editar `functions/index.js` línea 10:
```javascript
const TIMEZONE = 'America/Fortaleza'; // ← Tu zona horaria
```

---

## 🚀 DESPLEGAR (5 minutos)

### 1. Inicializar Firebase
```bash
firebase init
# Seleccionar: Firestore, Functions, Storage
# Use existing project → Tu proyecto
# JavaScript → Yes
# Install dependencies → Yes
```

### 2. Desplegar Todo
```bash
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only storage
```

Esperar 3-5 minutos... ☕

---

## 📱 EJECUTAR APP (2 minutos)

### 1. Conectar Dispositivo
```bash
# Conectar Android con USB o iniciar emulador
flutter devices
```

### 2. Ejecutar
```bash
flutter run
```

---

## 🎯 PRIMER USO (5 minutos)

### 1. Login
- [ ] Abrir app
- [ ] Click "Continuar con Google"
- [ ] Seleccionar tu cuenta (la del ADMIN_WHITELIST)

### 2. Crear Cartera
- [ ] Menú (👤) → Configuración
- [ ] Gestionar Carteras → Crear
- [ ] Nombre: "Cartera Principal"
- [ ] Contraseña: "admin123"
- [ ] Guardar

### 3. Desbloquear Cartera
- [ ] Volver al Home
- [ ] Seleccionar "Cartera Principal"
- [ ] Ingresar contraseña: "admin123"
- [ ] Desbloquear

### 4. Crear Cliente
- [ ] Ir a pestaña "Clientes"
- [ ] Click botón "+" (flotante)
- [ ] Llenar datos del cliente
- [ ] Guardar

### 5. Crear Préstamo
- [ ] Ir a pestaña "Préstamos"
- [ ] Click botón "+"
- [ ] Seleccionar cliente
- [ ] Monto: 1000
- [ ] Cuotas: 10
- [ ] Frecuencia: Semanal
- [ ] Crear

### 6. Pagar Cuota
- [ ] Click en el préstamo
- [ ] Ver cuotas
- [ ] Click "Pagar" en cuota #1
- [ ] Confirmar
- [ ] ¡Se marca verde 🟩!

---

## ✅ VERIFICACIÓN FINAL

Todo funciona si:
- [x] La app abre sin errores
- [x] Puedo hacer login con Google
- [x] Soy admin (veo opciones de admin)
- [x] Puedo crear y desbloquear cartera
- [x] Puedo crear cliente
- [x] Puedo crear préstamo
- [x] Las cuotas se crean automáticamente
- [x] Puedo pagar cuota
- [x] La cuota se marca verde 🟩
- [x] Veo estadísticas en Dashboard

---

## 🐛 PROBLEMAS COMUNES

### "App Check token is invalid"
```bash
flutter clean && flutter pub get && flutter run
```

### "Permission denied"
```bash
firebase deploy --only firestore:rules
```

### Functions no funcionan
```bash
firebase functions:log  # Ver errores
```

### Google Sign-In falla
1. Obtener SHA-1:
```bash
cd android && ./gradlew signingReport
```
2. Agregar SHA-1 en Firebase Console
3. Descargar nuevo `google-services.json`
4. Reemplazar en `android/app/`
5. `flutter clean && flutter run`

---

## 📚 DOCUMENTACIÓN COMPLETA

Si necesitas más detalles, ver:
- **SETUP_COMPLETO.md** - Guía paso a paso detallada
- **INSTALL.md** - Instalación completa
- **QUICKSTART.md** - Inicio rápido
- **APP_PREVIEW.md** - Vista previa de pantallas

---

## ⏱️ TIEMPO TOTAL: ~40 minutos

- Firebase Console: 15 min
- Configuración local: 10 min
- Desplegar: 5 min
- Ejecutar: 2 min
- Primer uso: 5 min
- Buffer: 3 min

---

## 🎉 ¡LISTO!

Tu app FinanGest está funcionando al 100%.

**Siguiente paso**: Cambiar contraseñas de prueba y empezar a usar.

**Soporte**: Ver `SETUP_COMPLETO.md` para troubleshooting detallado.
