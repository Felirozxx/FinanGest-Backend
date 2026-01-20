# 🔐 MI CONFIGURACIÓN - FinanGest

## ✅ CONFIGURACIÓN APLICADA

### 👤 Administradores
- **Email Principal**: fzuluaga548@gmail.com
- **Email de Respaldo**: finangestsoftware@gmail.com

**Ambos emails son ADMIN automáticamente al hacer login.**

### 🌍 Zona Horaria
- **Zona**: America/Sao_Paulo (Brasilia, Brasil)
- **Cierre del sistema**: 00:00 (medianoche de Brasilia)
- **Apertura del sistema**: 06:00 (6 AM de Brasilia)
- **Detección de atrasos**: 00:01 (Brasilia)

---

## 🚀 PASOS PARA INICIAR

### 1️⃣ Crear Proyecto en Firebase (15 min)

1. Ir a: https://console.firebase.google.com/
2. Click "Agregar proyecto"
3. Nombre: **FinanGest**
4. Habilitar Google Analytics: **SÍ**
5. Click "Crear proyecto"

### 2️⃣ Configurar Firebase Console

#### Authentication
1. Menú → **Authentication** → Comenzar
2. Habilitar **"Email/Password"**
3. Habilitar **"Google"**
   - Email de asistencia: **finangestsoftware@gmail.com**

#### Firestore Database
1. Menú → **Firestore Database** → Crear
2. Modo: **Producción**
3. Ubicación: **southamerica-east1** (São Paulo)

#### Cloud Functions (Plan Blaze)
1. Menú → **Functions** → Comenzar
2. Click "Actualizar proyecto"
3. Agregar método de pago
   - **No te preocupes**: Cuota gratuita de 2M invocaciones/mes
   - Solo pagas si excedes (muy difícil)

#### Storage
1. Menú → **Storage** → Comenzar
2. Modo: **Producción**
3. Ubicación: **southamerica-east1**

#### App Check
1. Menú → **App Check** → Comenzar
2. Registrar app Android
3. Proveedor: **Play Integrity**

### 3️⃣ Agregar App Android

1. En Firebase Console, click ícono **Android**
2. Paquete: `com.finangest.app`
3. Apodo: `FinanGest`
4. Click "Registrar app"
5. **DESCARGAR** `google-services.json`
6. Copiar a: `finangest-flutter/android/app/google-services.json`

---

## 💻 CONFIGURACIÓN LOCAL

### 1. Instalar Herramientas

```bash
# Verificar Flutter
flutter --version

# Instalar Firebase CLI
npm install -g firebase-tools

# Instalar FlutterFire CLI
dart pub global activate flutterfire_cli
```

### 2. Configurar Firebase

```bash
cd finangest-flutter

# Login a Firebase
firebase login
# Usar: finangestsoftware@gmail.com / Pipe16137356

# Configurar FlutterFire
flutterfire configure
# Seleccionar proyecto: FinanGest
```

### 3. Instalar Dependencias

```bash
# Flutter
flutter pub get

# Cloud Functions
cd functions
npm install
cd ..
```

### 4. Inicializar Firebase

```bash
firebase init

# Seleccionar (con ESPACIO):
# ✓ Firestore
# ✓ Functions
# ✓ Storage

# Preguntas:
# - Use existing project → FinanGest
# - Firestore rules → firestore.rules (ya existe)
# - Functions language → JavaScript
# - ESLint → No
# - Install dependencies → Yes
```

---

## 🚀 DESPLEGAR

```bash
# 1. Desplegar Firestore Rules
firebase deploy --only firestore:rules

# 2. Desplegar Cloud Functions (toma 3-5 min)
firebase deploy --only functions

# 3. Desplegar Storage Rules
firebase deploy --only storage
```

---

## 📱 EJECUTAR APP

### Conectar Dispositivo

```bash
# Conectar Android con USB o iniciar emulador
flutter devices
```

### Ejecutar

```bash
flutter run
```

---

## 🎯 PRIMER USO

### 1. Login como Admin

1. Abrir la app
2. Click "Continuar con Google"
3. Seleccionar: **fzuluaga548@gmail.com**
4. ¡Eres admin automáticamente! ✅

### 2. Crear Primera Cartera

1. Menú (👤) → Configuración
2. Administración → Gestionar Carteras
3. Click "Crear Cartera"
4. Datos:
   - Nombre: **Cartera Principal**
   - Contraseña: **admin123** (cámbiala después)
   - Confirmar contraseña: **admin123**
5. Click "Crear"

### 3. Desbloquear Cartera

1. Volver al Home
2. Aparecerá "Selecciona una Cartera"
3. Click en "Cartera Principal"
4. Ingresar contraseña: **admin123**
5. Click "Desbloquear"
6. ¡Listo! Ya puedes usar la app

### 4. Crear Primer Cliente

1. Ir a pestaña **"Clientes"**
2. Click botón flotante **"+"** (abajo derecha)
3. Llenar datos:
   - Nombre: João Silva
   - CPF: 123.456.789-01
   - Teléfono: +55 11 98765-4321
   - Ubicación: São Paulo, SP
   - Tipo de negocio: Comercio
   - Microseguro: 100
4. Click "Guardar"

### 5. Crear Primer Préstamo

1. Ir a pestaña **"Préstamos"**
2. Click botón flotante **"+"**
3. Datos:
   - Cliente: João Silva
   - Monto total: **R$ 1.000**
   - Número de cuotas: **10**
   - Frecuencia: **Semanal**
   - Primer vencimiento: (seleccionar fecha)
4. Click "Crear"
5. ¡El sistema crea automáticamente las 10 cuotas!

### 6. Registrar Primer Pago

1. En "Préstamos", click en el préstamo de João Silva
2. Ver lista de cuotas
3. Click "Pagar" en la cuota #1
4. Confirmar
5. ¡La cuota se marca verde 🟩!
6. El préstamo se actualiza automáticamente

---

## 🔐 CREDENCIALES

### Firebase Console
- **URL**: https://console.firebase.google.com/
- **Email**: finangestsoftware@gmail.com
- **Password**: Pipe16137356

### Emails Admin
- **Principal**: fzuluaga548@gmail.com
- **Respaldo**: finangestsoftware@gmail.com

### Zona Horaria
- **Zona**: America/Sao_Paulo (Brasilia)
- **UTC**: UTC-3

---

## ⏰ HORARIOS DEL SISTEMA

### Sistema Abierto
- **Desde**: 06:00 (Brasilia)
- **Hasta**: 23:59 (Brasilia)
- **Operaciones permitidas**: Todas

### Sistema Cerrado
- **Desde**: 00:00 (Brasilia)
- **Hasta**: 05:59 (Brasilia)
- **Operaciones bloqueadas**: Pagos, renovaciones, crear préstamos

### Tareas Automáticas
- **00:00**: Cierre del sistema
- **00:01**: Detección de atrasos (marca cuotas rojas 🟥)
- **06:00**: Apertura del sistema
- **Diario**: Backup automático

---

## 📊 VERIFICAR QUE TODO FUNCIONA

### Checklist:
- [ ] La app abre sin errores
- [ ] Puedo hacer login con fzuluaga548@gmail.com
- [ ] Soy admin (veo opciones de admin en Configuración)
- [ ] Puedo crear cartera "Cartera Principal"
- [ ] Puedo desbloquear la cartera
- [ ] Puedo crear cliente "João Silva"
- [ ] Puedo crear préstamo de R$ 1.000
- [ ] Las 10 cuotas se crean automáticamente
- [ ] Puedo pagar la cuota #1
- [ ] La cuota se marca verde 🟩
- [ ] El préstamo se actualiza (paidAmount, remainingAmount)
- [ ] Veo estadísticas en el Dashboard
- [ ] El sistema muestra "Abierto" entre 06:00-00:00

Si todos los checks están ✓, ¡tu app está 100% funcional!

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "App Check token is invalid"
```bash
flutter clean
flutter pub get
flutter run
```

### Error: "Permission denied" en Firestore
```bash
firebase deploy --only firestore:rules
```

### Functions no se ejecutan
```bash
# Ver logs
firebase functions:log

# Verificar que estén desplegadas
firebase functions:list
```

### Google Sign-In falla
1. Obtener SHA-1:
```bash
cd android
./gradlew signingReport
# Copiar el SHA-1
```

2. Agregar en Firebase Console:
   - Configuración del proyecto → Tus apps
   - Click en app Android
   - Agregar huella digital SHA-1

3. Descargar nuevo `google-services.json`
4. Reemplazar en `android/app/`
5. `flutter clean && flutter run`

---

## 📞 SOPORTE

### Ver Logs
```bash
# Flutter logs
flutter logs

# Firebase Functions logs
firebase functions:log

# Crashlytics
# Firebase Console → Crashlytics
```

### Verificar Estado
```bash
# Verificar conexión
flutter doctor

# Verificar Functions desplegadas
firebase functions:list

# Verificar Rules
firebase firestore:rules get
```

---

## 🎉 ¡LISTO PARA USAR!

Tu app FinanGest está configurada con:
- ✅ Tus emails como admin
- ✅ Zona horaria de Brasilia
- ✅ Todas las funcionalidades activas
- ✅ Seguridad completa implementada

**Tiempo estimado de configuración**: 40 minutos

**Próximos pasos**:
1. Seguir los pasos de este archivo
2. Crear tu primera cartera
3. Empezar a usar la app

---

**FinanGest** - Sistema profesional de gestión de cobranzas
Configurado para: fzuluaga548@gmail.com
Zona horaria: Brasilia (America/Sao_Paulo)
