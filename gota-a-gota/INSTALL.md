# Instalación - App Gota a Gota

## Requisitos Previos

- Node.js (versión 16 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## Instalación

### 1. Clonar o descargar el proyecto

```bash
cd gota-a-gota
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gota-a-gota
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
NODE_ENV=development

# Email configuration (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

### 4. Configurar MongoDB

#### Opción A: MongoDB Local
- Instala MongoDB en tu sistema
- Inicia el servicio de MongoDB
- La URI por defecto es: `mongodb://localhost:27017/gota-a-gota`

#### Opción B: MongoDB Atlas (Recomendado)
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un nuevo cluster
3. Obtén la URI de conexión
4. Actualiza `MONGODB_URI` en tu archivo `.env`

### 5. Crear usuario administrador

```bash
node scripts/create-admin.js
```

Esto creará un usuario administrador con las siguientes credenciales:
- **Usuario**: admin
- **Contraseña**: admin123
- **Email**: admin@gotaagota.com

⚠️ **IMPORTANTE**: Cambia la contraseña después del primer login.

### 6. Iniciar la aplicación

#### Modo desarrollo:
```bash
npm run dev
```

#### Modo producción:
```bash
npm start
```

### 7. Acceder a la aplicación

Abre tu navegador y ve a: `http://localhost:3000`

## Estructura del Proyecto

```
gota-a-gota/
├── backend/
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middleware de autenticación
│   ├── scripts/         # Scripts de utilidad
│   └── server.js        # Servidor principal
├── frontend/
│   ├── css/            # Estilos
│   ├── js/             # JavaScript del frontend
│   └── index.html      # Página principal
└── docs/               # Documentación
```

## Funcionalidades

### ✅ Implementadas
- Sistema de autenticación (JWT)
- Gestión de clientes
- Creación de préstamos
- Registro de pagos
- Dashboard con estadísticas
- Reportes básicos

### 🚧 Por implementar
- Notificaciones automáticas
- Reportes avanzados
- Backup automático
- App móvil
- Integración con pasarelas de pago

## Usuarios y Roles

### Administrador (`admin`)
- Acceso completo al sistema
- Gestión de usuarios
- Configuración del sistema

### Cobrador (`collector`)
- Gestión de clientes
- Creación de préstamos
- Registro de pagos
- Visualización de reportes

### Visualizador (`viewer`)
- Solo lectura
- Visualización de reportes

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Crear administrador
node scripts/create-admin.js

# Verificar conexión a BD
node scripts/test-connection.js
```

## Solución de Problemas

### Error de conexión a MongoDB
1. Verifica que MongoDB esté ejecutándose
2. Revisa la URI en el archivo `.env`
3. Verifica las credenciales de MongoDB Atlas

### Puerto en uso
Si el puerto 3000 está ocupado, cambia `PORT` en el archivo `.env`

### Problemas de autenticación
1. Verifica que `JWT_SECRET` esté configurado
2. Limpia el localStorage del navegador
3. Recrea el usuario administrador

## Soporte

Para reportar problemas o solicitar funcionalidades, crea un issue en el repositorio del proyecto.