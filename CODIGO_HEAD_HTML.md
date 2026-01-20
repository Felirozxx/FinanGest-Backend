# 📄 Código para el <head> de index.html

## Copia y pega este código en el `<head>` de tu archivo HTML:

```html
<!-- PWA Meta Tags -->
<meta name="description" content="Sistema de gestión financiera para control de préstamos y pagos">
<meta name="theme-color" content="#00bfff">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="FinanGest">

<!-- PWA Icons -->
<link rel="icon" type="image/png" sizes="192x192" href="/icons/Icon-192.png">
<link rel="apple-touch-icon" href="/icons/Icon-192.png">

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">
```

---

## 📄 Código para antes de cerrar `</body>`:

```html
<!-- PWA Service Worker Registration -->
<script>
    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registrado exitosamente:', registration.scope);
                    
                    // Verificar actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Hay una nueva versión disponible
                                if (confirm('¡Nueva versión disponible! ¿Deseas actualizar?')) {
                                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                                    window.location.reload();
                                }
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.log('Error al registrar Service Worker:', error);
                });
        });
    }

    // Detectar si la app está instalada
    let deferredPrompt;
    const installBtn = document.querySelector('.install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Mostrar botón de instalación
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
            
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);
                    deferredPrompt = null;
                }
            });
        }
    });

    // Detectar cuando la app ya está instalada
    window.addEventListener('appinstalled', () => {
        console.log('FinanGest instalado exitosamente');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });
</script>
```

---

## ✅ Ya está aplicado en tu proyecto

**Nota:** Ya he actualizado automáticamente tu archivo `public/index.html` con estos cambios, así que no necesitas copiar y pegar manualmente. Solo sigue las instrucciones del archivo `INSTRUCCIONES_DEPLOY.md` para subir los cambios a GitHub.
