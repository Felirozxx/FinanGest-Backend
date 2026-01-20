# 📋 PASOS EXACTOS - FinanGest

## ⏱️ TIEMPO TOTAL: 40 MINUTOS

---

# 🔥 PASO 1: FIREBASE CONSOLE (15 minutos)

## 1.1 Crear Proyecto (3 min)

1. Abrir navegador
2. Ir a: **https://console.firebase.google.com/**
3. Click botón **"Agregar proyecto"** (o "Add project")
4. Escribir nombre: **FinanGest**
5. Click **"Continuar"**
6. Habilitar Google Analytics: **Dejar activado** ✓
7. Click **"Continuar"**
8. Cuenta de Analytics: **Default Account for Firebase**
9. Click **"Crear proyecto"**
10. Esperar 30 segundos...
11. Click **"Continuar"**

✅ **Listo: Proyecto creado**

---

## 1.2 Habilitar Authentication (2 min)

1. En el menú lateral izquierdo, buscar **"Authentication"**
2. Click en **"Authentication"**
3. Click botón **"Comenzar"** (o "Get started")
4. Verás lista de proveedores

### Habilitar Email/Password:
5. Click en **"Correo electrónico/contraseña"** (Email/Password)
6. Activar el primer switch (Habilitar)
7. Click **"Guardar"**

### Habilitar Google:
8. Click en **"Google"**
9. Activar el switch (Habilitar)
10. Email de asistencia del proyecto: **finangestsoftware@gmail.com**
11. Click **"Guardar"**

✅ **Listo: Authentication configurado**

---

## 1.3 Crear Firestore Database (2 min)

1. En el menú lateral, click **"Firestore Database"**
2. Click botón **"Crear base de datos"** (Create database)
3. Seleccionar modo: **"Iniciar en modo de producción"** (Production mode)
4. Click **"Siguiente"**
5. Ubicación: Seleccionar **"southamerica-east1 (São Paulo)"**
   - Si no aparece, seleccionar la más cercana
6. Click **"Habilitar"** (Enable)
7. Esperar 1-2 minutos...

✅ **Listo: Firestore creado**

---

## 1.4 Actualizar a Plan Blaze (3 min)

⚠️ **IMPORTANTE**: Necesario para Cloud Functions

1. En el menú lateral, click **"Functions"**
2. Click **"Comenzar"** (Get started)
3. Aparecerá mensaje: "Actualizar proyecto"
4. Click **"Actualizar proyecto"** (Upgrade project)
5. Seleccionar plan: **"Blaze (Pago por uso)"**
6. Click **"Continuar"**
7. Agregar método de pago (tarjeta de crédito/débito)
8. Click **"Comprar"** o "Confirmar"

💡 **No te preocupes:**
- Cuota gratuita: 2,000,000 invocaciones/mes
- Solo pagas si excedes (muy difícil en desarrollo)
- Puedes establecer límites de gasto

✅ **Listo: Plan Blaze activado**

---

## 1.5 Habilitar Storage (1 min)

1. En el menú lateral, click **"Storage"**
2. Click **"Comenzar"** (Get started)
3. Modo: **"Iniciar en modo de producción"** (Production mode)
4. Click **"Siguiente"**
5. Ubicación: **southamerica-east1** (la misma que Firestore)
6. Click **"Listo"** (Done)

✅ **Listo: Storage habilitado**

---

## 1.6 Configurar App Check (2 min)

1. En el menú lateral, click **"App Check"**
2. Click **"Comenzar"** (Get started)
3. Verás mensaje sobre registrar apps
4. Por ahora, solo click **"Continuar"**
   - Lo configuraremos después de agregar la app Android

✅ **Listo: App Check iniciado**

---

## 1.7 Agregar App Android (2 min)

1. En la página principal del proyecto, buscar **"Tus apps"**
2. Click en el ícono de **Android** (robot verde)
3. Llenar formulario:
   - **Nombre del paquete de Android**: `com.finangest.app`
   - **Apodo de la app**: `FinanGest`
   - **SHA-1**: Dejar vacío por ahora
4. Click **"Registrar app"**
5. **MUY IMPORTANTE**: Click en **"Descargar google-services.json"**
6. Guardar el archivo en tu computadora (Descargas)
7. Click **"Siguiente"** → **"Siguiente"** → **"Continuar a la consola"**

✅ **Listo: App Android agregada**

---

# 💻 PASO 2: CONFIGURACIÓN LOCAL (10 minutos)

## 2.1 Verificar Herramientas (2 min)

Abrir **Terminal** (o CMD en Windows) y ejecutar:

```bash
# Verificar Flutter
flutter --version
```

**Debe mostrar**: Flutter 3.x.x

```bash
# Verificar Node.js
node --version
```

**Debe mostrar**: v18.x.x o superior

```bash
# Verificar Firebase CLI
firebase --version
```

**Debe mostrar**: 13.x.x o superior

### ❌ Si algo falta:

**Flutter:**
- Descargar: https://flutter.dev/docs/get-started/install
- Seguir instrucciones para tu sistema operativo

**Node.js:**
- Descargar: https://nodejs.org/ (versión LTS)
- Instalar y reiniciar terminal

**Firebase CLI:**
```bash
npm install -g firebase-tools
```

✅ **Listo: Herramientas verificadas**

---

## 2.2 Instalar FlutterFire CLI (1 min)

En la terminal:

```bash
dart pub global activate flutterfire_cli
```

Esperar que termine...

✅ **Listo: FlutterFire CLI instalado**

---

## 2.3 Ir a la Carpeta del Proyecto (1 min)

```bash
# Ir a donde está la carpeta finangest-flutter
cd ruta/a/finangest-flutter

# Ejemplo en Windows:
# cd C:\Users\TuUsuario\Desktop\finangest-flutter

# Ejemplo en Mac/Linux:
# cd ~/Desktop/finangest-flutter
```

Verificar que estás en la carpeta correcta:

```bash
ls
# o en Windows:
dir
```

**Debes ver**: pubspec.yaml, lib/, functions/, etc.

✅ **Listo: En la carpeta correcta**

---

## 2.4 Login a Firebase (1 min)

```bash
firebase login
```

1. Se abrirá el navegador
2. Seleccionar cuenta: **finangestsoftware@gmail.com**
3. Permitir acceso
4. Volver a la terminal

**Debe mostrar**: "✔ Success! Logged in as finangestsoftware@gmail.com"

✅ **Listo: Login exitoso**

---

## 2.5 Configurar FlutterFire (2 min)

```bash
flutterfire configure
```

1. Pregunta: "Select a Firebase project"
   - Usar flechas ↑↓ para seleccionar **FinanGest**
   - Presionar **Enter**

2. Pregunta: "Which platforms should your configuration support?"
   - Dejar seleccionado: **android** (con X)
   - Si quieres iOS también, seleccionarlo
   - Presionar **Enter**

3. Esperar que termine...

**Debe mostrar**: 
- "✔ Firebase configuration file lib/firebase_options.dart generated successfully"

✅ **Listo: FlutterFire configurado**

---

## 2.6 Copiar google-services.json (1 min)

1. Buscar el archivo **google-services.json** que descargaste (en Descargas)
2. Copiarlo a: **finangest-flutter/android/app/**

En terminal:

```bash
# Windows (desde Descargas):
copy %USERPROFILE%\Downloads\google-services.json android\app\

# Mac/Linux (desde Descargas):
cp ~/Downloads/google-services.json android/app/
```

Verificar que esté copiado:

```bash
# Windows:
dir android\app\google-services.json

# Mac/Linux:
ls android/app/google-services.json
```

**Debe mostrar**: El archivo existe

✅ **Listo: google-services.json copiado**

---

## 2.7 Instalar Dependencias (2 min)

### Flutter:
```bash
flutter pub get
```

Esperar que termine...

### Cloud Functions:
```bash
cd functions
npm install
cd ..
```

Esperar 1-2 minutos...

✅ **Listo: Dependencias instaladas**

---

# 🚀 PASO 3: INICIALIZAR Y DESPLEGAR (10 minutos)

## 3.1 Inicializar Firebase (3 min)

```bash
firebase init
```

### Preguntas y respuestas:

1. **"Which Firebase features do you want to set up?"**
   - Usar **ESPACIO** para seleccionar:
     - ✓ Firestore
     - ✓ Functions
     - ✓ Storage
   - Presionar **Enter**

2. **"Please select an option:"**
   - Seleccionar: **"Use an existing project"**
   - Presionar **Enter**

3. **"Select a default Firebase project:"**
   - Seleccionar: **FinanGest**
   - Presionar **Enter**

4. **"What file should be used for Firestore Rules?"**
   - Escribir: **firestore.rules**
   - Presionar **Enter**

5. **"File firestore.rules already exists. Do you want to overwrite?"**
   - Escribir: **N** (No)
   - Presionar **Enter**

6. **"What file should be used for Firestore indexes?"**
   - Presionar **Enter** (dejar por defecto)

7. **"What language would you like to use to write Cloud Functions?"**
   - Seleccionar: **JavaScript**
   - Presionar **Enter**

8. **"Do you want to use ESLint?"**
   - Escribir: **N** (No)
   - Presionar **Enter**

9. **"File functions/package.json already exists. Overwrite?"**
   - Escribir: **N** (No)
   - Presionar **Enter**

10. **"File functions/index.js already exists. Overwrite?"**
    - Escribir: **N** (No)
    - Presionar **Enter**

11. **"Do you want to install dependencies with npm now?"**
    - Escribir: **Y** (Yes)
    - Presionar **Enter**

12. **"What file should be used for Storage Rules?"**
    - Presionar **Enter** (dejar por defecto)

Esperar que termine...

✅ **Listo: Firebase inicializado**

---

## 3.2 Desplegar Firestore Rules (2 min)

```bash
firebase deploy --only firestore:rules
```

Esperar 30 segundos...

**Debe mostrar**: "✔ Deploy complete!"

✅ **Listo: Firestore Rules desplegadas**

---

## 3.3 Desplegar Cloud Functions (4 min)

⚠️ **IMPORTANTE**: Esto toma 3-5 minutos

```bash
firebase deploy --only functions
```

Verás muchas líneas desplegándose...

**Debe mostrar al final**:
```
✔ functions[onUserCreate]: Successful create operation.
✔ functions[createWallet]: Successful create operation.
✔ functions[unlockWallet]: Successful create operation.
... (15+ funciones)
✔ Deploy complete!
```

✅ **Listo: Cloud Functions desplegadas**

---

## 3.4 Desplegar Storage Rules (1 min)

```bash
firebase deploy --only storage
```

Esperar 30 segundos...

**Debe mostrar**: "✔ Deploy complete!"

✅ **Listo: Storage Rules desplegadas**

---

# 📱 PASO 4: EJECUTAR LA APP (5 minutos)

## 4.1 Conectar Dispositivo (2 min)

### Opción A: Dispositivo Android Real

1. Conectar tu Android con cable USB
2. En el Android:
   - Ir a Ajustes → Acerca del teléfono
   - Tocar 7 veces en "Número de compilación"
   - Volver a Ajustes → Opciones de desarrollador
   - Activar "Depuración USB"
3. Aceptar en el teléfono cuando pregunte

### Opción B: Emulador Android

1. Abrir Android Studio
2. Tools → Device Manager
3. Click "Create Device"
4. Seleccionar un dispositivo (ej: Pixel 5)
5. Seleccionar imagen del sistema (ej: Android 13)
6. Click "Finish"
7. Click en el botón ▶️ para iniciar

### Verificar:

```bash
flutter devices
```

**Debe mostrar**: Tu dispositivo o emulador

✅ **Listo: Dispositivo conectado**

---

## 4.2 Ejecutar la App (3 min)

```bash
flutter run
```

Esperar 2-3 minutos (primera vez toma más tiempo)...

**Debe mostrar**:
```
✓ Built build/app/outputs/flutter-apk/app-debug.apk
```

La app se instalará y abrirá automáticamente en tu dispositivo.

✅ **Listo: App ejecutándose**

---

# 🎯 PASO 5: USAR LA APP (5 minutos)

## 5.1 Login (1 min)

1. La app abrirá en la pantalla de **Login**
2. Click en botón **"Continuar con Google"**
3. Seleccionar cuenta: **fzuluaga548@gmail.com**
4. Aceptar permisos
5. ¡Entrarás como ADMIN automáticamente! ✅

---

## 5.2 Crear Primera Cartera (1 min)

1. Verás mensaje: "Selecciona una Cartera"
2. Como no hay carteras, ir a:
   - Click en el ícono de perfil (👤) arriba derecha
   - Click en **"Configuración"**
3. Scroll hasta **"Administración"**
4. Click en **"Gestionar Carteras"**
5. Click en botón **"+"** o "Crear Cartera"
6. Llenar:
   - **Nombre**: Cartera Principal
   - **Contraseña**: admin123
   - **Confirmar contraseña**: admin123
7. Click **"Crear"**

✅ **Listo: Cartera creada**

---

## 5.3 Desbloquear Cartera (30 seg)

1. Volver al **Home** (botón atrás o icono de casa)
2. Aparecerá: "Selecciona una Cartera"
3. Click en **"Cartera Principal"**
4. Ingresar contraseña: **admin123**
5. Click **"Desbloquear"**
6. ¡Listo! Ya puedes usar la app

✅ **Listo: Cartera desbloqueada**

---

## 5.4 Crear Primer Cliente (1 min)

1. Ir a pestaña **"Clientes"** (abajo)
2. Click en botón flotante **"+"** (abajo derecha)
3. Llenar datos:
   - **Nombre**: João Silva
   - **CPF**: 12345678901
   - **Teléfono**: +55 11 98765-4321
   - **Ubicación**: São Paulo, SP
   - **Tipo de negocio**: Comercio
   - **Microseguro**: 100
4. Click **"Guardar"**

✅ **Listo: Cliente creado**

---

## 5.5 Crear Primer Préstamo (1 min)

1. Ir a pestaña **"Préstamos"** (abajo)
2. Click en botón flotante **"+"**
3. Llenar:
   - **Cliente**: Seleccionar "João Silva"
   - **Monto total**: 1000
   - **Número de cuotas**: 10
   - **Frecuencia**: Semanal
   - **Primer vencimiento**: Seleccionar fecha (ej: mañana)
4. Click **"Crear"**
5. ¡El sistema crea automáticamente las 10 cuotas!

✅ **Listo: Préstamo creado**

---

## 5.6 Registrar Primer Pago (30 seg)

1. En la lista de préstamos, click en el préstamo de João Silva
2. Verás la lista de 10 cuotas
3. Click en botón **"Pagar"** en la cuota #1
4. Confirmar el pago
5. ¡La cuota se marca VERDE 🟩!
6. El préstamo se actualiza automáticamente:
   - Pagado: R$ 100
   - Restante: R$ 900

✅ **Listo: Primer pago registrado**

---

# ✅ VERIFICACIÓN FINAL

## Checklist - Todo debe funcionar:

- [x] La app abre sin errores
- [x] Puedo hacer login con fzuluaga548@gmail.com
- [x] Soy admin (veo opciones de admin en Configuración)
- [x] Puedo crear cartera "Cartera Principal"
- [x] Puedo desbloquear la cartera con "admin123"
- [x] Puedo crear cliente "João Silva"
- [x] Puedo crear préstamo de R$ 1.000
- [x] Las 10 cuotas se crean automáticamente
- [x] Puedo pagar la cuota #1
- [x] La cuota se marca verde 🟩
- [x] El préstamo se actualiza (paidAmount, remainingAmount)
- [x] Veo estadísticas en el Dashboard
- [x] El sistema muestra "Abierto" entre 06:00-00:00 (Brasilia)

---

# 🎉 ¡FELICITACIONES!

Tu app **FinanGest** está 100% funcional.

## 📊 Resumen de Tiempo:

- ✅ Firebase Console: 15 min
- ✅ Configuración Local: 10 min
- ✅ Desplegar: 10 min
- ✅ Ejecutar: 5 min
- ✅ Usar: 5 min

**TOTAL: 45 minutos** ⏱️

---

## 🔐 Tus Credenciales:

- **Firebase Console**: https://console.firebase.google.com/
- **Email**: finangestsoftware@gmail.com
- **Password**: Pipe16137356
- **Admin**: fzuluaga548@gmail.com
- **Zona Horaria**: Brasilia (UTC-3)

---

## 📚 Próximos Pasos:

1. Cambiar contraseña de cartera "admin123" por una segura
2. Crear más usuarios (workers)
3. Asignar carteras a workers
4. Empezar a usar en producción

---

## 🆘 Si Algo Falla:

Ver archivo: **SETUP_COMPLETO.md** (tiene soluciones detalladas)

---

**¡Disfruta tu app FinanGest!** 🚀
