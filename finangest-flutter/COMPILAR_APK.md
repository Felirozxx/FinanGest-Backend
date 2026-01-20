# 📱 GUÍA PARA COMPILAR APK

## ✅ PASO 1: Instalar Android Studio

### Descargar:
```
https://developer.android.com/studio
```

### Durante instalación marcar:
- ✅ Android SDK
- ✅ Android SDK Platform
- ✅ Android Virtual Device

---

## ✅ PASO 2: Configurar Variables de Entorno

Después de instalar Android Studio, agregar al PATH:

```
C:\Users\TU_USUARIO\AppData\Local\Android\Sdk\platform-tools
C:\Users\TU_USUARIO\AppData\Local\Android\Sdk\tools
```

---

## ✅ PASO 3: Aceptar Licencias de Android

Abrir PowerShell y ejecutar:

```powershell
C:\flutter\bin\flutter.bat doctor --android-licenses
```

Presionar `y` para aceptar todas las licencias.

---

## ✅ PASO 4: Compilar APK

En la carpeta del proyecto:

```powershell
cd C:\Users\Felipe\Desktop\FinanGest-Deploy\finangest-flutter
C:\flutter\bin\flutter.bat build apk --release
```

---

## 📦 RESULTADO:

El APK estará en:
```
build\app\outputs\flutter-apk\app-release.apk
```

---

## 📲 INSTALAR EN CELULAR:

1. Copia el APK a tu celular
2. Habilita "Instalar apps desconocidas" en Configuración
3. Abre el APK y instala

---

## ⏱️ TIEMPO ESTIMADO:

- Instalación Android Studio: 20-30 min
- Primera compilación APK: 10-15 min
- Compilaciones siguientes: 2-3 min
