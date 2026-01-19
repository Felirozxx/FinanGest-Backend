# FinanGest - Despliegue Automático

## 🚀 Desplegar en 2 Pasos

### Paso 1: Desplegar Backend en Vercel

1. Abre este link: https://vercel.com/new
2. Importa este proyecto desde tu computadora o GitHub
3. Vercel detectará automáticamente la configuración
4. Agrega estas variables de entorno:
   - `MONGODB_URI`: mongodb+srv://Felirozxx:Pipe16137356@cluster0.luvtqa7.mongodb.net/finangest?retryWrites=true&w=majority
   - `EMAIL_USER`: tu_email@gmail.com
   - `EMAIL_PASS`: tu_app_password
5. Click en "Deploy"
6. **COPIA LA URL** que te da (ejemplo: https://finangest-backend.vercel.app)

### Paso 2: Actualizar y Desplegar Frontend

1. Dime la URL que te dio Vercel
2. Yo actualizo el código automáticamente
3. Sube la carpeta `public` a Netlify

## O usa este comando rápido:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar backend
vercel --prod

# Te dará una URL, cópiala
```

Luego dime la URL y actualizo el frontend.
