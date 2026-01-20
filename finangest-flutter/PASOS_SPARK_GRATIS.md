# 🆓 PASOS PARA PLAN SPARK (100% GRATIS)

## ✅ LO QUE TENDRÁS:

- ✅ Login con Email y Google
- ✅ Dashboard completo con estadísticas
- ✅ Crear/editar clientes
- ✅ Crear préstamos con cuotas automáticas
- ✅ Registrar pagos
- ✅ Sistema automático de horarios (12 AM cierre, 6 AM apertura)
- ✅ Marcar cuotas vencidas automáticamente
- ✅ Gestión de carteras
- ✅ Todo 100% GRATIS, sin tarjeta

## 🚫 LO QUE NO TENDRÁS:

- ❌ Cloud Functions del servidor (no las necesitas)

---

# 📋 PASOS RÁPIDOS (30 minutos)

## 1. FIREBASE CONSOLE (10 min)

### 1.1 Crear Proyecto
1. Ir a: https://console.firebase.google.com/
2. Click "Agregar proyecto"
3. Nombre: **FinanGest**
4. Habilitar Google Analytics: ✓
5. Click "Crear proyecto"

### 1.2 Habilitar Authentication
1. Menu → **Authentication** → "Comenzar"
2. Habilitar **Email/Password**
3. Habilitar **Google** (email soporte: fzuluaga548@gmail.com)

### 1.3 Crear Firestore Database
1. Menu → **Firestore Database** → "Crear base de datos"
2. Modo: **Producción**
3. Ubicación: **southamerica-east1 (São Paulo)**
4. Click "Habilitar"

### 1.4 Habilitar Storage
1. Menu → **Storage** → "Comenzar"
2. Modo: **Producción**
3. Ubicación: **southamerica-east1**
4. Click "Listo"

### 1.5 Agregar App Android
1. Click ícono **Android** (robot verde)
2. Paquete: `com.finangest.app`
3. Apodo: `FinanGest`
4. Click "Registrar app"
5. **DESCARGAR google-services.json** (importante!)
6. Click "Continuar a la consola"

✅ **Firebase listo - Plan Spark (GRATIS)**

---

## 2. CONFIGURACIÓN LOCAL (10 min)

### 2.1 Verificar Herramientas

```bash
flutter --version  # Debe mostrar Flutter 3.x
firebase --version # Debe mostrar 13.x
```

Si falta Firebase CLI:
```bash
npm install -g firebase-tools
```

### 2.2 Instalar FlutterFire CLI

```bash
dart pub global activate flutterfire_cli
```

### 2.3 Ir a la Carpeta

```bash
cd ruta/a/finangest-flutter
```

### 2.4 Login a Firebase

```bash
firebase login
```

Seleccionar: **fzuluaga548@gmail.com**

### 2.5 Configurar FlutterFire

```bash
flutterfire configure
```

- Seleccionar proyecto: **FinanGest**
- Plataformas: **android** (con X)
- Enter

### 2.6 Copiar google-services.json

```bash
# Windows:
copy %USERPROFILE%\Downloads\google-services.json android\app\

# Mac/Linux:
cp ~/Downloads/google-services.json android/app/
```

### 2.7 Instalar Dependencias

```bash
flutter pub get
```

---

## 3. DESPLEGAR REGLAS (5 min)

### 3.1 Inicializar Firebase

```bash
firebase init
```

Respuestas:
- Features: **Firestore, Storage** (con ESPACIO)
- Proyecto: **Use an existing project** → **FinanGest**
- Firestore Rules: **firestore.rules** → **N** (No overwrite)
- Firestore Indexes: Enter (default)
- Storage Rules: Enter (default)

### 3.2 Desplegar Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 3.3 Desplegar Storage Rules

```bash
firebase deploy --only storage
```

✅ **Reglas desplegadas**

---

## 4. EJECUTAR LA APP (5 min)

### 4.1 Conectar Dispositivo

**Opción A: Android Real**
- Conectar con USB
- Activar "Depuración USB"

**Opción B: Emulador**
- Abrir Android Studio → Device Manager
- Crear/iniciar emulador

Verificar:
```bash
flutter devices
```

### 4.2 Ejecutar

```bash
flutter run
```

Esperar 2-3 minutos...

✅ **App ejecutándose!**

---

## 5. USAR LA APP

### 5.1 Login
1. Click "Continuar con Google"
2. Seleccionar: **fzuluaga548@gmail.com**
3. ¡Entras como ADMIN automáticamente!

### 5.2 Crear Cartera
1. Ir a Configuración (👤 → Configuración)
2. "Gestionar Carteras" → "+"
3. Nombre: **Cartera Principal**
4. Contraseña: **admin123**
5. Click "Crear"

### 5.3 Desbloquear Cartera
1. Volver al Home
2. Seleccionar "Cartera Principal"
3. Contraseña: **admin123**
4. Click "Desbloquear"

### 5.4 Crear Cliente
1. Pestaña "Clientes" → "+"
2. Llenar datos
3. Click "Guardar"

### 5.5 Crear Préstamo
1. Pestaña "Préstamos" → "+"
2. Seleccionar cliente
3. Monto: 1000
4. Cuotas: 10
5. Frecuencia: Semanal
6. Click "Crear"

### 5.6 Registrar Pago
1. Click en el préstamo
2. Click "Pagar" en cuota #1
3. Confirmar

✅ **¡Todo funciona!**

---

## 🕐 SISTEMA AUTOMÁTICO DE HORARIOS

### ¿Cómo funciona?

**🌙 12:00 AM (Medianoche):**
- Sistema se cierra automáticamente
- Marca cuotas vencidas
- Guarda registro del día
- **BLOQUEA** todas las acciones (crear, editar, pagar)
- Solo permite **VER** datos

**🌅 6:00 AM:**
- Sistema se abre automáticamente
- Permite todas las operaciones
- Guarda registro de apertura

**Entre 12 AM - 6 AM:**
- Pantalla especial: "Sistema Cerrado"
- Puedes ver Dashboard y datos
- NO puedes crear/editar/pagar
- Mensaje: "Solo lectura hasta las 6:00 AM"

### Indicador Visual

En la barra superior verás:
- 🟢 **Abierto** (6 AM - 12 AM)
- 🔴 **Cerrado** (12 AM - 6 AM)

### ¿Necesito hacer algo?

**¡NO!** Todo es automático:
- La app verifica cada minuto
- Cambia de estado automáticamente
- Marca cuotas vencidas automáticamente
- Bloquea/desbloquea acciones automáticamente

---

## 💰 COSTOS

**Plan Spark (Actual):**
- ✅ 100% GRATIS
- ✅ Sin tarjeta
- ✅ Sin cargos ocultos

**Límites (más que suficiente):**
- 50,000 lecturas/día
- 20,000 escrituras/día
- 1GB almacenamiento
- 10GB transferencia/mes

**Para tu negocio:**
- 50 clientes activos = ~1,500 lecturas/día
- 100 pagos/día = ~500 escrituras/día
- **Totalmente dentro del límite gratuito**

---

## 🎯 VERIFICACIÓN FINAL

- [x] App abre sin errores
- [x] Login con fzuluaga548@gmail.com funciona
- [x] Soy admin
- [x] Puedo crear cartera
- [x] Puedo desbloquear cartera
- [x] Puedo crear clientes
- [x] Puedo crear préstamos
- [x] Las cuotas se crean automáticamente
- [x] Puedo registrar pagos
- [x] Veo estadísticas en Dashboard
- [x] Sistema muestra 🟢 Abierto (6 AM - 12 AM)
- [x] Sistema muestra 🔴 Cerrado (12 AM - 6 AM)
- [x] Durante cierre, solo puedo VER datos
- [x] Durante apertura, puedo hacer TODO

---

## 🎉 ¡LISTO!

Tu app **FinanGest** está 100% funcional y 100% GRATIS.

### Credenciales:

- **Firebase**: https://console.firebase.google.com/
- **Email**: fzuluaga548@gmail.com
- **Admin**: fzuluaga548@gmail.com
- **Zona Horaria**: Brasilia (UTC-3)
- **Plan**: Spark (Gratis)

### Características Automáticas:

- ✅ Cierre diario a las 12 AM
- ✅ Apertura diaria a las 6 AM
- ✅ Marcado automático de cuotas vencidas
- ✅ Bloqueo de acciones durante cierre
- ✅ Indicador visual de estado
- ✅ Logs de sistema

---

**¡Disfruta tu app FinanGest 100% GRATIS!** 🚀
