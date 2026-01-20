# 📋 PASOS EXACTOS - FinanGest (100% GRATIS)

## ⏱️ TIEMPO TOTAL: 25 MINUTOS

---

# 🔥 PASO 1: FIREBASE CONSOLE (10 minutos)

## 1.1 Crear Proyecto (3 min)

1. Ir a: **https://console.firebase.google.com/**
2. Click **"Agregar proyecto"**
3. Nombre: **FinanGest**
4. Click **"Continuar"**
5. Google Analytics: **Activado** ✓
6. Click **"Continuar"**
7. Cuenta: **Default Account for Firebase**
8. Click **"Crear proyecto"**
9. Esperar... Click **"Continuar"**

✅ **Listo: Proyecto creado**

---

## 1.2 Habilitar Authentication (2 min)

1. Menú lateral → **"Authentication"**
2. Click **"Comenzar"**

### Email/Password:
3. Click **"Correo electrónico/contraseña"**
4. Activar switch
5. Click **"Guardar"**

### Google:
6. Click **"Google"**
7. Activar switch
8. Email de asistencia: **fzuluaga548@gmail.com**
9. Click **"Guardar"**

✅ **Listo: Authentication configurado**

---

## 1.3 Crear Firestore Database (2 min)

1. Menú lateral → **"Firestore Database"**
2. Click **"Crear base de datos"**
3. Modo: **"Iniciar en modo de producción"**
4. Click **"Siguiente"**
5. Ubicación: **"southamerica-east1 (São Paulo)"**
6. Click **"Habilitar"**
7. Esperar 1-2 minutos...

✅ **Listo: Firestore creado**

---

## 1.4 Habilitar Storage (1 min)

1. Menú lateral → **"Storage"**
2. Click **"Comenzar"**
3. Modo: **"Producción"**
4. Click **"Siguiente"**
5. Ubicación: **southamerica-east1**
6. Click **"Listo"**

✅ **Listo: Storage habilitado**

---

## 1.5 Agregar App Android (2 min)

1. Página principal → Click ícono **Android**
2. Llenar:
   - Paquete: `com.finangest.app`
   - Apodo: `FinanGest`
3. Click **"Registrar app"**
4. **Descargar google-services.json** (guardar en Descargas)
5. Click **"Siguiente"** → **"Siguiente"** → **"Continuar"**

✅ **Listo: App Android agregada**

---

# 💻 PASO 2: CONFIGURACIÓN LOCAL (10 minutos)

## 2.1 Ir a la Carpeta (1 min)

```bash
cd ruta/a/finangest-flutter
```

---

## 2.2 Login a Firebase (1 min)

```bash
firebase login
```

Seleccionar: **fzuluaga548@gmail.com**

✅ **Listo: Login exitoso**

---

## 2.3 Configurar FlutterFire (2 min)

```bash
flutterfire configure
```

1. Seleccionar proyecto: **FinanGest**
2. Plataformas: **android** (con X)
3. Presionar Enter

✅ **Listo: FlutterFire configurado**

---

## 2.4 Copiar google-services.json (1 min)

```bash
# Windows:
copy %USERPROFILE%\Downloads\google-services.json android\app\

# Mac/Linux:
cp ~/Downloads/google-services.json android/app/
```

✅ **Listo: Archivo copiado**

---

## 2.5 Instalar Dependencias (2 min)

```bash
flutter pub get
```

✅ **Listo: Dependencias instaladas**

---

## 2.6 Desplegar Firestore Rules (3 min)

```bash
firebase init firestore
```

1. Proyecto: **Use an existing project** → **FinanGest**
2. Rules file: **firestore.rules** (Enter)
3. Overwrite: **N** (No)
4. Indexes: Enter (dejar por defecto)

```bash
firebase deploy --only firestore:rules
```

✅ **Listo: Rules desplegadas**

---

# 📱 PASO 3: EJECUTAR LA APP (5 minutos)

## 3.1 Conectar Dispositivo (2 min)

### Android Real:
- Conectar USB
- Activar "Depuración USB"

### Emulador:
- Abrir desde Android Studio

Verificar:
```bash
flutter devices
```

✅ **Listo: Dispositivo conectado**

---

## 3.2 Ejecutar (3 min)

```bash
flutter run
```

Esperar 2-3 minutos...

✅ **Listo: App ejecutándose**

---

# 🎯 PASO 4: USAR LA APP

## 4.1 Login

1. Click **"Continuar con Google"**
2. Seleccionar: **fzuluaga548@gmail.com**
3. ¡Entras como ADMIN! ✅

---

## 4.2 Crear Cliente

1. Pestaña **"Clientes"**
2. Click **"+"**
3. Llenar datos
4. Click **"Guardar"**

---

## 4.3 Crear Préstamo

1. Pestaña **"Préstamos"**
2. Click **"+"**
3. Seleccionar cliente
4. Monto: 1000
5. Cuotas: 10
6. Frecuencia: Semanal
7. Click **"Crear"**

---

## 4.4 Registrar Pago

1. Click en el préstamo
2. Click **"Pagar"** en cuota #1
3. Confirmar
4. ¡Cuota marcada verde! 🟩

---

# ✅ ¡LISTO!

Tu app está 100% funcional y **GRATIS PARA SIEMPRE**.

## 📊 Límites del Plan Gratuito:

- 50,000 lecturas/día
- 20,000 escrituras/día
- 1GB almacenamiento
- 10GB transferencia/mes

**Más que suficiente para empezar** 🚀

---

## 🔐 Credenciales:

- **Firebase**: https://console.firebase.google.com/
- **Email**: fzuluaga548@gmail.com
- **Admin**: fzuluaga548@gmail.com

---

## 📱 Funcionalidades Incluidas:

✅ Login con Email/Google
✅ Dashboard con estadísticas
✅ Gestionar clientes
✅ Crear préstamos
✅ Registrar pagos
✅ Ver cuotas vencidas
✅ Reportes y gráficos
✅ Multi-usuario (admin/worker)
✅ Seguridad completa

---

**¡Disfruta tu app FinanGest!** 🎉
