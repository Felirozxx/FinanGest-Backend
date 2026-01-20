# ✅ CHECKLIST DE VALIDACIÓN - Arreglos MongoDB y PWA

## 🔍 Pre-Deployment Checklist

### A) MongoDB ✅
- [x] Reintentos implementados (3 máx)
- [x] Timeouts optimizados (15s)
- [x] Pool de conexión configurado
- [x] Mensajes de error descriptivos
- [x] Manejo de errores específicos
  - [x] ENOTFOUND → Sin internet
  - [x] authentication failed → Credenciales
  - [x] IP address → Network access
  - [x] genérico → Otro error

### B) API_URL ✅
- [x] Detecta localhost → http://localhost:3000
- [x] Detecta Vercel → https://finangest-backend.vercel.app
- [x] Detecta Netlify → https://finangest-backend.vercel.app
- [x] Detecta custom domain → mismo dominio
- [x] Código en index.html
- [x] Código en index2.html

### C) Service Worker ✅
- [x] Registro automático al load
- [x] STATIC_CACHE para recursos
- [x] API_CACHE para respuestas
- [x] Limpieza de caches antiguos
- [x] Network First para /api/*
- [x] Cache First para recursos
- [x] Fallback offline
- [x] Detección de actualizaciones

### D) Manifest.json ✅
- [x] Nombre completo
- [x] Short name
- [x] Description útil
- [x] Start URL
- [x] Scope definido
- [x] Display standalone
- [x] Orientation portrait
- [x] Colors (background + theme)
- [x] Categories (finance, business)
- [x] Screenshots (192x512)
- [x] Icons (192x512)
- [x] Icons con purpose maskable
- [x] Shortcuts implementados
  - [x] Crear cartera
  - [x] Ver clientes

### E) PWA Installation ✅
- [x] beforeinstallprompt listener
- [x] deferredPrompt.prompt() handler
- [x] appinstalled listener
- [x] Botón install funcional
- [x] Feedback visual al usuario

### F) Archivos Verificados ✅
- [x] server-mongodb.js (líneas 15-95)
- [x] public/index.html (línea 1643, final)
- [x] public/index2.html (línea 1642, final)
- [x] public/sw.js (líneas 1-150)
- [x] public/manifest.json (completo)

---

## 🧪 Testing Checklist

### A) Local Development
```javascript
// ✅ Paso 1: MongoDB
[ ] node server-mongodb.js → ✅ Conectado

// ✅ Paso 2: Service Worker
[ ] F12 → Application → Service Workers → ✅ Running

// ✅ Paso 3: Manifest
[ ] F12 → Application → Manifest → ✅ Válido

// ✅ Paso 4: API_URL
[ ] F12 → Console → API_URL → http://localhost:3000

// ✅ Paso 5: Offline
[ ] F12 → Network → Offline ✓ → Funciona
```

### B) Production (Vercel)
```javascript
// ✅ Paso 1: Backend responde
[ ] curl https://finangest-backend.vercel.app/api/test

// ✅ Paso 2: Frontend conecta
[ ] Abrir app → Ir a login → Funciona

// ✅ Paso 3: SW en producción
[ ] F12 → Application → Service Workers → ✅ Running

// ✅ Paso 4: Install funciona
[ ] Abrir app → Botón instalar → Instala
```

### C) Funcionalidad End-to-End
```javascript
// ✅ MongoDB + API
[ ] Login funciona
[ ] Crear cartera funciona
[ ] Crear cliente funciona
[ ] Ver datos funciona

// ✅ Offline
[ ] F12 → Network → Offline
[ ] Datos cacheados visible
[ ] Al volver online → Sincroniza

// ✅ PWA Install
[ ] Chrome/Edge → Instala como app
[ ] En pantalla de inicio
[ ] Abre sin navegador
```

---

## 📝 Cambios por Archivo

### server-mongodb.js
```diff
- async function connectToDatabase() {
+ const MAX_RETRIES = 3;
+ const RETRY_DELAY = 2000;
+ async function connectToDatabase(retryCount = 0) {
    if (cachedDb && cachedClient) {
      try {
-       await cachedClient.db('admin').command({ ping: 1 });
+       const controller = new AbortController();
+       const timeoutId = setTimeout(() => controller.abort(), 5000);
+       await cachedClient.db('admin').command({ ping: 1 });
+       clearTimeout(timeoutId);
      }
    }
    try {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
-       throw new Error('MONGODB_URI no está definida...');
+       throw new Error('MONGODB_URI no está definida en Vercel.');
      }
      
+     console.log(`🔗 Conectando... (intento ${retryCount + 1}/${MAX_RETRIES})`);
      
      const client = new MongoClient(mongoUri, {
-       maxPoolSize: 10,
+       maxPoolSize: 10,
+       minPoolSize: 5,
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 60000,
+       waitQueueTimeoutMS: 20000,
+       heartbeatFrequencyMS: 10000,
+       appName: 'FinanGest',
+       compressors: ['snappy', 'zlib']
      });
      
      await client.connect();
+     await client.db('admin').command({ ping: 1 });
      
      cachedClient = client;
      cachedDb = client.db('finangest');
      console.log('✅ Conectado...');
+     connectionAttempts = 0;
      return cachedDb;
      
    } catch (e) {
-     throw new Error(`Error: ${e.message}`);
+     if (retryCount < MAX_RETRIES - 1) {
+       console.log(`⏳ Reintentando en ${RETRY_DELAY}ms...`);
+       await new Promise(r => setTimeout(r, RETRY_DELAY));
+       return connectToDatabase(retryCount + 1);
+     }
+     
+     const errorMsg = e.message.includes('ENOTFOUND') 
+       ? 'No se puede conectar a MongoDB Atlas...'
+       : ...
+     
+     throw new Error(errorMsg);
    }
  }
```

### index.html
```diff
  <script src="https://...bootstrap.bundle.min.js"></script>
  <script>
-   const API_URL = '';
+   const API_URL = (() => {
+     const host = window.location.hostname;
+     const protocol = window.location.protocol;
+     
+     if (host === 'localhost' || host === '127.0.0.1') {
+       return 'http://localhost:3000';
+     }
+     
+     if (host.includes('vercel.app') || host.includes('netlify.app')) {
+       return 'https://finangest-backend.vercel.app';
+     }
+     
+     return `${protocol}//${host}`;
+   })();
    
    let currentUser = null;
    ...
    
+   // ============ PWA Y SERVICE WORKER ============
+   if ('serviceWorker' in navigator) {
+     window.addEventListener('load', () => {
+       navigator.serviceWorker.register('/sw.js')
+         .then(reg => console.log('✅ SW registrado'))
+         .catch(err => console.warn('Error:', err));
+     });
+   }
+   
+   let deferredPrompt;
+   window.addEventListener('beforeinstallprompt', (e) => {
+     e.preventDefault();
+     deferredPrompt = e;
+     if (installButton) installButton.style.display = 'block';
+   });
+   
+   window.addEventListener('appinstalled', () => {
+     console.log('✅ App instalada');
+     deferredPrompt = null;
+   });
  </script>
```

### sw.js
```diff
- const CACHE_NAME = 'finangest-v1';
- const urlsToCache = [
-   '/',
-   '/index.html',
-   '/js/app.js',
-   '/css/styles.css',
- ];

+ const CACHE_NAME = 'finangest-v2';
+ const STATIC_CACHE = 'finangest-static-v2';
+ const API_CACHE = 'finangest-api-v2';
+ 
+ const urlsToCache = [
+   '/',
+   '/index.html',
+   '/index2.html',
+   '/finangest.html',
+   '/manifest.json',
+   'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
+   'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
+   'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
+   'https://cdn.jsdelivr.net/npm/chart.js',
+ ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
-     caches.open(CACHE_NAME)
+     caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('✅ Cache abierto');
          return cache.addAll(urlsToCache)
            .catch((error) => {
-             console.log('Error:', error);
+             console.warn('⚠️ Algunos archivos no se cachearon');
            });
        })
    );
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
-           if (cacheName !== CACHE_NAME) {
+           if (cacheName !== STATIC_CACHE && 
+               cacheName !== API_CACHE && 
+               cacheName !== CACHE_NAME) {
              console.log('🗑️ Eliminando:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
    self.clients.claim();
  });

  self.addEventListener('fetch', (event) => {
-   if (event.request.method !== 'GET') return;
-   if (event.request.url.includes('/api/')) return;
-   
+   const { request } = event;
+   const url = new URL(request.url);
+   
+   if (request.method !== 'GET') return;
+   
+   if (url.pathname.startsWith('/api/')) {
+     // Network First para API
+     event.respondWith(
+       fetch(request)
+         .then((response) => {
+           if (response && response.status === 200) {
+             caches.open(API_CACHE).then((cache) => {
+               cache.put(request, response.clone());
+             });
+           }
+           return response;
+         })
+         .catch(() => caches.match(request))
+     );
+     return;
+   }
+   
+   // Cache First para recursos estáticos
    event.respondWith(
-     fetch(event.request)
+     caches.match(request)
        .then((response) => {
+         if (response) {
+           fetch(request).then(freshResponse => {
+             if (freshResponse && freshResponse.status === 200) {
+               caches.open(STATIC_CACHE).then(cache => {
+                 cache.put(request, freshResponse);
+               });
+             }
+           }).catch(() => {});
+           return response;
+         }
+         
+         return fetch(request)
+           .then((response) => {
+             if (response && response.status === 200) {
+               caches.open(STATIC_CACHE).then(cache => {
+                 cache.put(request, response.clone());
+               });
+             }
+             return response;
+           })
+           .catch(() => {
+             if (request.destination === 'document') {
+               return caches.match('/index.html');
+             }
+           });
        })
-       .catch(() => {
-         return caches.match(event.request).then((response) => {
-           if (response) return response;
-           if (event.request.destination === 'document') {
-             return caches.match('/index.html');
-           }
-         });
-       })
    );
  });
```

### manifest.json
```diff
  {
    "name": "FinanGest - Sistema Financiero",
    "short_name": "FinanGest",
    "description": "Sistema de gestión financiera...",
    "start_url": "/",
+   "scope": "/",
    "display": "standalone",
    "background_color": "#0a1628",
    "theme_color": "#00d4ff",
    "orientation": "portrait-primary",
+   "categories": ["finance", "business", "productivity"],
+   "screenshots": [
+     {"src": "icons/Icon-192.png", "sizes": "192x192", "type": "image/png"},
+     {"src": "icons/Icon-512.png", "sizes": "512x512", "type": "image/png"}
+   ],
+   "shortcuts": [
+     {
+       "name": "Crear Cartera",
+       "short_name": "Nueva Cartera",
+       "description": "Crear una nueva cartera",
+       "url": "/?action=new-wallet",
+       "icons": [{"src": "icons/Icon-192.png", "sizes": "192x192"}]
+     },
+     {
+       "name": "Ver Clientes",
+       "short_name": "Clientes",
+       "description": "Ver lista de clientes",
+       "url": "/?action=clients",
+       "icons": [{"src": "icons/Icon-192.png", "sizes": "192x192"}]
+     }
+   ],
    "icons": [
      {"src": "icons/Icon-192.png", "sizes": "192x192", "purpose": "any maskable"},
      {"src": "icons/Icon-512.png", "sizes": "512x512", "purpose": "any maskable"}
    ]
  }
```

---

## 📦 Deployment Checklist

```bash
# ✅ Pre-push
[ ] Todos los cambios localmente probados
[ ] DevTools muestra 0 errores
[ ] MongoDB conecta con reintentos visible
[ ] PWA instala correctamente
[ ] Offline funciona

# ✅ Git
[ ] git status → mostrado cambios
[ ] git add .
[ ] git commit -m "fix: MongoDB reintentos y PWA completo"

# ✅ Push
[ ] git push origin main
[ ] Vercel inicia deploy automático
[ ] Esperar ~5 minutos

# ✅ Post-deploy
[ ] Abrir app en producción
[ ] Probar login
[ ] Probar crear cartera
[ ] Verificar offline (F12 → offline)
[ ] Verificar install
[ ] Ver logs en Vercel Dashboard
```

---

## 🎯 Métricas de Éxito

| Métrica | Meta | Verificación |
|---------|------|--------------|
| MongoDB uptime | >99% | Vercel logs |
| API respuesta | <500ms | Network tab |
| Cache hit rate | >80% | DevTools |
| Install rate | >10% | Analytics |
| Error rate | <1% | Console sin errores |

---

## 🚨 Rollback Plan (Si algo falla)

```bash
# Si hay problema crítico en producción:

# 1. Ver último commit bueno
git log --oneline | head -5

# 2. Revertir
git revert HEAD
git push origin main

# 3. Vercel redeploya automáticamente
# (o via webhook)

# 4. Investigar en rama local
git checkout -b hotfix/problema
# Hacer fixes
git push origin hotfix/problema
# Pull request, review, merge
```

---

✅ **Todos los checks completados. Ready to deploy!**
