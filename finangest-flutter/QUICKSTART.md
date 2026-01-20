# 🚀 FinanGest - Inicio Rápido

## 📦 Contenido del Paquete

```
finangest-flutter/
├── lib/                          # Código Flutter
│   ├── main.dart                 # Punto de entrada
│   ├── models/                   # Modelos de datos
│   │   ├── user_model.dart
│   │   ├── wallet_model.dart
│   │   ├── client_model.dart
│   │   ├── loan_model.dart
│   │   └── installment_model.dart
│   ├── providers/                # State management
│   │   ├── auth_provider.dart
│   │   ├── wallet_provider.dart
│   │   ├── client_provider.dart
│   │   ├── loan_provider.dart
│   │   └── stats_provider.dart
│   ├── screens/                  # Pantallas
│   │   ├── splash_screen.dart
│   │   ├── auth/
│   │   │   └── login_screen.dart
│   │   └── home/
│   │       ├── home_screen.dart
│   │       ├── dashboard_screen.dart
│   │       ├── clients_screen.dart
│   │       ├── loans_screen.dart
│   │       ├── payments_screen.dart
│   │       └── settings_screen.dart
│   ├── utils/                    # Utilidades
│   │   ├── theme.dart
│   │   └── app_localizations.dart
│   └── firebase_options.dart     # Config Firebase
├── functions/                    # Cloud Functions
│   ├── index.js                  # 15+ funciones
│   └── package.json
├── assets/
│   └── translations/
│       ├── es.json               # Español
│       └── pt.json               # Português
├── firestore.rules               # Reglas de seguridad
├── pubspec.yaml                  # Dependencias
├── INSTALL.md                    # Guía de instalación
├── SECURITY.md                   # Documentación de seguridad
└── APP_PREVIEW.md                # Vista previa visual
```

## ⚡ Instalación en 5 Pasos

### 1️⃣ Requisitos Previos

```bash
# Verificar Flutter
flutter --version

# Verificar Node.js (para Cloud Functions)
node --version

# Instalar Firebase CLI
npm install -g firebase-tools
firebase login
```

### 2️⃣ Configurar Firebase

```bash
# Crear proyecto en Firebase Console
# https://console.firebase.google.com/

# Habilitar servicios:
# ✅ Authentication (Email + Google)
# ✅ Firestore Database
# ✅ Cloud Functions (Plan Blaze)
# ✅ Storage
# ✅ App Check

# Configurar Firebase en el proyecto
cd finangest-flutter
firebase init

# Seleccionar:
# ✅ Firestore
# ✅ Functions
# ✅ Storage

# Configurar FlutterFire
flutterfire configure
```

### 3️⃣ Instalar Dependencias

```bash
# Flutter
flutter pub get

# Cloud Functions
cd functions
npm install
cd ..
```

### 4️⃣ Configurar Admin y Zona Horaria

Editar `functions/index.js`:

```javascript
// Línea 10-11
const TIMEZONE = 'America/Fortaleza'; // Tu zona horaria
const ADMIN_WHITELIST = ['tu-email@dominio.com']; // Email del admin
```

### 5️⃣ Desplegar y Ejecutar

```bash
# Desplegar Firestore Rules
firebase deploy --only firestore:rules

# Desplegar Cloud Functions
firebase deploy --only functions

# Ejecutar app
flutter run

# O build para producción
flutter build apk --release
```

## 🎯 Primer Uso

### Crear Usuario Admin

1. Registrarte con el email que pusiste en `ADMIN_WHITELIST`
2. El sistema automáticamente te asignará rol de admin
3. Crear tu primera cartera desde la app

### Crear Cartera

1. Login como admin
2. Ir a Configuración → Gestionar Carteras
3. Crear nueva cartera con nombre y contraseña
4. La contraseña se guarda hasheada (bcrypt)

### Crear Cliente y Préstamo

1. Desbloquear cartera con contraseña
2. Ir a Clientes → Agregar Cliente
3. Llenar datos (nombre, CPF, teléfono, etc.)
4. Ir a Préstamos → Agregar Préstamo
5. Seleccionar cliente, monto, cuotas, frecuencia
6. El sistema crea automáticamente todas las cuotas

### Registrar Pago

1. Ir a Préstamos
2. Seleccionar préstamo activo
3. Ver cuotas pendientes
4. Tocar "Pagar" en una cuota
5. Confirmar → Se marca como pagada 🟩
6. Se actualiza el préstamo automáticamente

## 🔐 Seguridad Implementada

✅ Firebase App Check activado
✅ Firestore Rules estrictas por rol
✅ Cloud Functions para lógica crítica
✅ Server timestamps (no hora del celular)
✅ Idempotencia en operaciones
✅ Hash bcrypt para contraseñas
✅ Bloqueo 10 intentos → 5 min
✅ Auditoría completa
✅ Soft delete
✅ Backups automáticos

## 🎨 Características

### Colores Automáticos
- 🟩 **Verde**: Cuota pagada
- 🟥 **Rojo**: Cuota atrasada (automático)
- 🟪 **Morado**: Préstamo saldado
- ⚪ **Blanco**: Cuota pendiente

### Sistema Automático
- Cierre diario: 00:00
- Apertura diaria: 06:00
- Detección de atrasos: 00:01
- Backups: Diarios

### Roles
- **Admin**: Control total, gestión de usuarios/carteras
- **Worker**: Gestión de clientes, préstamos, pagos

## 📱 Pantallas

1. **Splash** → Carga inicial
2. **Login** → Email/Password o Google
3. **Dashboard** → Estadísticas en tiempo real
4. **Clientes** → Lista con búsqueda
5. **Préstamos** → Con colores y progreso
6. **Pagos** → Historial completo
7. **Configuración** → Perfil y admin panel

## 🌍 Multilenguaje

Cambiar idioma en `lib/main.dart`:

```dart
locale: const Locale('es', ''), // Español
// o
locale: const Locale('pt', ''), // Português
```

## 🐛 Solución de Problemas

### Error: "App Check token is invalid"
```bash
# Verificar SHA-256 en Firebase Console
# Android: keytool -list -v -keystore ~/.android/debug.keystore
# Agregar SHA-256 en Firebase Console → Project Settings
```

### Error: "Permission denied" en Firestore
```bash
# Verificar que las rules estén desplegadas
firebase deploy --only firestore:rules

# Verificar que el usuario tenga rol asignado
# Firestore Console → users → [tu-uid] → role
```

### Functions no se ejecutan
```bash
# Verificar logs
firebase functions:log

# Verificar plan Blaze activo
# Firebase Console → Upgrade to Blaze
```

## 📚 Documentación

- `INSTALL.md` - Instalación detallada
- `SECURITY.md` - Matriz de amenazas y defensas
- `APP_PREVIEW.md` - Vista previa visual de pantallas
- `functions/index.js` - Documentación de Cloud Functions
- `firestore.rules` - Reglas de seguridad comentadas

## 🆘 Soporte

### Logs útiles
```bash
# Flutter logs
flutter logs

# Firebase Functions logs
firebase functions:log

# Firestore logs
# Firebase Console → Firestore → Usage
```

### Verificar estado
```bash
# Verificar conexión Firebase
flutter run --verbose

# Verificar Functions desplegadas
firebase functions:list

# Verificar Rules
firebase firestore:rules get
```

## ✅ Checklist de Producción

Antes de lanzar:

- [ ] Firebase App Check configurado
- [ ] Firestore Rules desplegadas
- [ ] Cloud Functions desplegadas
- [ ] Admin whitelist configurado
- [ ] Zona horaria correcta
- [ ] Scheduled functions activas
- [ ] Backups automáticos funcionando
- [ ] Crashlytics configurado
- [ ] Términos y privacidad actualizados
- [ ] Testing en dispositivos reales
- [ ] Keystore de producción (Android)
- [ ] Certificados de producción (iOS)

## 🎉 ¡Listo!

Tu app FinanGest está lista para usar. Todas las funcionalidades están implementadas y probadas.

**Versión**: 1.0.0
**Fecha**: Enero 2026
**Stack**: Flutter + Firebase

---

Para más información, consulta:
- INSTALL.md (instalación completa)
- SECURITY.md (seguridad y amenazas)
- APP_PREVIEW.md (vista previa visual)
