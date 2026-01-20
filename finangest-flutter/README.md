# FinanGest - Sistema Profesional de Gestión de Cobranzas

## 📱 Descripción
Sistema profesional de gestión de cobranzas con Flutter + Firebase.

## 🌍 Idiomas
- Español
- Português

## 🏗️ Arquitectura

### Frontend
- **Flutter** (Android/iOS)
- UI profesional tipo Conteo
- Multilenguaje (ES/PT)
- Animaciones y calendario

### Backend
- **Firebase Authentication** (Email + Google)
- **Firebase Firestore** (Base de datos)
- **Firebase Cloud Functions** (Lógica de negocio)
- **Firebase Storage** (Backups)
- **Firebase App Check** (Seguridad)

## 🔐 Seguridad

### Implementado
✅ Firebase App Check (Firestore + Functions)
✅ Firestore Security Rules estrictas
✅ Rate limiting (IP + uid + device)
✅ Bloqueo 10 intentos → 5 min
✅ Hash bcrypt para contraseñas de cartera
✅ Auditoría completa de acciones
✅ Server timestamps (no hora del celular)
✅ Idempotencia en operaciones críticas
✅ Soft delete + backups automáticos
✅ Crashlytics + manejo offline

## 📋 Características Principales

### Roles
- **Admin**: Control total (definido por whitelist)
- **Workers**: Perfiles internos por cartera

### Carteras
- Contraseñas hasheadas por cartera
- Máx 10 intentos → bloqueo 5 min
- Logs de acceso

### Clientes
- Nombre, CPF, ubicación, tipo de negocio
- Microseguro (informativo)
- Historial completo con timeline

### Préstamos/Cuotas
- Creación automática de cuotas por servidor
- Estados: pending | paid
- Colores automáticos:
  - 🟩 VERDE: Pagó cuota del día
  - 🟥 ROJO: Cuota atrasada (automático)
  - 🟪 MORADO: Pagó todo (saldo 0)

### Acciones
- Pagar cuota
- Renovar cuota
- Pagar todo
- Gestión de atrasos automática

### Estadísticas
- Dashboard diario por cartera
- Calendario con stats congeladas
- Mejores clientes (ranking)
- Gastos separados

### Sistema
- Cierre automático 00:00
- Apertura automática 06:00
- Backups automáticos diarios
- Exportes CSV/PDF

## 🚀 Instalación

Ver [INSTALL.md](INSTALL.md)

## 📚 Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Seguridad](docs/SECURITY.md)
- [API Functions](docs/FUNCTIONS.md)
- [Firestore Rules](docs/RULES.md)

## 📄 Legal

- Términos de uso
- Política de privacidad (LGPD)
- Consentimiento obligatorio