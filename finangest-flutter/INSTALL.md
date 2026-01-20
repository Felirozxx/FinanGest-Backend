# Instalación - FinanGest Flutter

## 📋 Requisitos Previos

- Flutter SDK (3.0.0 o superior)
- Android Studio / Xcode
- Node.js (18 o superior) para Cloud Functions
- Firebase CLI
- Cuenta de Firebase

## 🚀 Instalación

### 1. Configurar Firebase

#### a) Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto: "FinanGest"
3. Habilita Google Analytics (opcional)

#### b) Habilitar servicios
- **Authentication**: Email/Password + Google Sign-In
- **Firestore Database**: Modo producción
- **Cloud Functions**: Plan Blaze (requerido)
- **Storage**: Para backups
- **App Check**: Activar con Play Integrity (Android) / App Attest (iOS)
- **Crashlytics**: Para monitoreo de errores

#### c) Configurar Authentication
1. En Authentication > Sign-in method
2. Habilitar "Email/Password"
3. Habilitar "Google"
4. Configurar dominio autorizado

### 2. Instalar Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 3. Inicializar Firebase en el proyecto

```bash
cd finangest-flutter
firebase init
```

Seleccionar:
- ✅ Firestore
- ✅ Functions
- ✅ Storage
- ✅ Hosting (opcional)

### 4. Configurar FlutterFire

```bash
# Instalar FlutterFire CLI
dart pub global activate flutterfire_cli

# Configurar Firebase para Flutter
flutterfire configure
```

Esto creará automáticamente:
- `lib/firebase_options.dart`
- Configuración para Android e iOS

### 5. Instalar dependencias de Flutter

```bash
flutter pub get
```

### 6. Configurar Cloud Functions

```bash
cd functions
npm install
```

#### Editar `functions/index.js`:
- Cambiar `TIMEZONE` según tu zona horaria
- Actualizar `ADMIN_WHITELIST` con el email del admin

```javascript
const TIMEZONE = 'America/Fortaleza'; // Tu zona horaria
const ADMIN_WHITELIST = ['admin@tudominio.com']; // Email del admin
```

### 7. Desplegar Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 8. Desplegar Cloud Functions

```bash
firebase deploy --only functions
```

### 9. Configurar App Check

#### Android (Play Integrity)
1. En Firebase Console > App Check
2. Registrar tu app Android
3. Habilitar Play Integrity API en Google Cloud Console
4. Agregar SHA-256 de tu keystore

#### iOS (App Attest)
1. En Firebase Console > App Check
2. Registrar tu app iOS
3. App Attest se configura automáticamente

### 10. Ejecutar la app

```bash
# Android
flutter run

# iOS
flutter run -d ios

# Release
flutter build apk --release
flutter build ios --release
```

## 🔐 Configuración de Seguridad

### Whitelist de Admin

Editar `functions/index.js`:

```javascript
const ADMIN_WHITELIST = [
  'admin@finangest.com',
  'otro-admin@finangest.com'
];
```

Redesplegar:
```bash
firebase deploy --only functions
```

### Configurar Rate Limiting

En Firebase Console > App Check:
- Configurar límites por endpoint
- Habilitar protección contra bots

### Configurar Scheduled Functions

Las funciones programadas requieren plan Blaze:
- `checkOverdueInstallments`: Diario a las 00:01
- `dailyClose`: Diario a las 00:00
- `dailyOpen`: Diario a las 06:00

Verificar en Firebase Console > Functions > Logs

## 📱 Configuración de la App

### Cambiar idioma por defecto

Editar `lib/main.dart`:

```dart
locale: const Locale('es', ''), // Español
// o
locale: const Locale('pt', ''), // Português
```

### Personalizar tema

Editar `lib/utils/theme.dart`

### Configurar zona horaria

Editar `functions/index.js`:

```javascript
const TIMEZONE = 'America/Sao_Paulo'; // Brasil
// const TIMEZONE = 'America/Bogota'; // Colombia
// const TIMEZONE = 'America/Mexico_City'; // México
```

## 🧪 Testing

### Emuladores locales

```bash
firebase emulators:start
```

Esto inicia:
- Firestore Emulator
- Functions Emulator
- Authentication Emulator

### Conectar app a emuladores

Descomentar en `lib/main.dart`:

```dart
// Para desarrollo local
// await FirebaseFirestore.instance.useFirestoreEmulator('localhost', 8080);
// await FirebaseFunctions.instance.useFunctionsEmulator('localhost', 5001);
```

## 📊 Monitoreo

### Crashlytics

Ver crashes en Firebase Console > Crashlytics

### Analytics

Ver uso en Firebase Console > Analytics

### Logs de Functions

```bash
firebase functions:log
```

## 🔄 Backups

### Backup automático

Las Cloud Functions crean backups diarios automáticamente en Storage.

### Backup manual

Desde la app (solo admin):
- Ir a Configuración
- Seleccionar "Crear Backup"
- El backup se guarda en Firebase Storage

### Restaurar backup

Solo admin puede restaurar:
- Ir a Configuración > Backups
- Seleccionar backup
- Confirmar restauración (crea copia, no sobrescribe)

## 🌍 Multilenguaje

### Agregar traducciones

1. Crear archivo en `assets/translations/`:
   - `es.json` (Español)
   - `pt.json` (Português)

2. Formato:
```json
{
  "app_name": "FinanGest",
  "login": "Iniciar Sesión",
  "email": "Correo Electrónico",
  ...
}
```

3. Usar en la app:
```dart
Text(AppLocalizations.of(context).translate('login'))
```

## 🚨 Solución de Problemas

### Error: "App Check token is invalid"
- Verificar que App Check esté habilitado
- Verificar SHA-256 en Firebase Console
- Regenerar y desplegar

### Error: "Permission denied" en Firestore
- Verificar Firestore Rules
- Verificar que el usuario tenga rol asignado
- Verificar que tenga acceso a la cartera

### Functions no se ejecutan
- Verificar plan Blaze activo
- Ver logs: `firebase functions:log`
- Verificar zona horaria en scheduled functions

### App no conecta a Firebase
- Verificar `google-services.json` (Android)
- Verificar `GoogleService-Info.plist` (iOS)
- Ejecutar `flutterfire configure` nuevamente

## 📚 Documentación Adicional

- [Arquitectura](docs/ARCHITECTURE.md)
- [Seguridad](docs/SECURITY.md)
- [API Functions](docs/FUNCTIONS.md)
- [Firestore Schema](docs/SCHEMA.md)

## 🆘 Soporte

Para problemas o preguntas:
1. Revisar logs de Crashlytics
2. Revisar logs de Functions
3. Verificar Firestore Rules
4. Contactar al equipo de desarrollo

## ✅ Checklist de Producción

Antes de lanzar a producción:

- [ ] Firebase App Check activado
- [ ] Firestore Rules desplegadas
- [ ] Cloud Functions desplegadas
- [ ] Admin whitelist configurado
- [ ] Zona horaria correcta
- [ ] Scheduled functions funcionando
- [ ] Backups automáticos activos
- [ ] Crashlytics configurado
- [ ] Rate limiting configurado
- [ ] Términos y política de privacidad actualizados
- [ ] Testing completo en dispositivos reales
- [ ] Keystore de producción configurado (Android)
- [ ] Certificados de producción (iOS)
