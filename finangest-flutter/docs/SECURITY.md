# Seguridad - FinanGest

## 🛡️ Matriz de Amenazas y Defensas

### 1. Bots / Scripts atacando la base de datos

**Amenaza**: Alguien usa scripts para leer/escribir Firestore sin la app.

**Riesgo**: Robo de datos (CPF), creación de pagos falsos, spam.

**✅ Defensas**:
- Firebase App Check activado para Firestore + Functions
- Firestore Rules estrictas (solo acceso permitido)
- Acciones críticas solo por Cloud Functions
- Rate limiting por IP/uid/device

---

### 2. Fuerza bruta de contraseña admin

**Amenaza**: Probar muchas contraseñas al admin.

**Riesgo**: Toma de control total.

**✅ Defensas**:
- Whitelist de admin (solo emails específicos pueden ser admin)
- 10 fallos → bloqueo 5 min (server)
- Rate-limit en login/acciones admin
- Alertas al correo de respaldo por intentos sospechosos
- Reautenticación para acciones críticas

**Implementación**:
```javascript
// functions/index.js
const ADMIN_WHITELIST = ['admin@finangest.com'];
const MAX_ATTEMPTS = 10;
const LOCKOUT_MINUTES = 5;
```

---

### 3. Fuerza bruta de contraseña por cartera

**Amenaza**: Adivinar contraseñas de cartera.

**Riesgo**: Entrar a carteras no autorizadas.

**✅ Defensas**:
- Contraseña hasheada con bcrypt (nunca en texto plano)
- Validación en backend
- 10 fallos → bloqueo 5 min por cartera
- Logs de intentos por cartera
- Rate-limit específico para "unlock cartera"

**Implementación**:
```javascript
// Hash de contraseña
const passwordHash = await bcrypt.hash(password, 12);

// Verificación
const isValid = await bcrypt.compare(password, wallet.passwordHash);
```

---

### 4. Escalada de privilegios (worker → admin)

**Amenaza**: Editar `role=admin` en la DB.

**Riesgo**: Control total.

**✅ Defensas**:
- Campo `role` solo puede cambiarlo Cloud Functions
- Firestore Rules: prohibir writes a `role`, `availableWallets`
- Admin definido por whitelist (email)
- Auditoría de cambios de roles

**Firestore Rules**:
```javascript
allow update: if !request.resource.data.diff(resource.data)
  .affectedKeys().hasAny(['role', 'availableWallets']);
```

---

### 5. Manipulación del tiempo (cambiar hora del celular)

**Amenaza**: Adelantar/atrasar hora para evitar atrasos o cierre.

**Riesgo**: Falsificación de estados rojo/verde/morado.

**✅ Defensas**:
- Todos los timestamps con `serverTimestamp()`
- Atrasos y cierres calculados por backend
- App solo muestra lo que el servidor decide
- Zona horaria definida en servidor

**Implementación**:
```javascript
// Cloud Functions
const getServerTime = () => {
  return moment().tz('America/Fortaleza');
};

// Firestore
createdAt: admin.firestore.FieldValue.serverTimestamp()
```

---

### 6. Duplicación de pagos por reintentos

**Amenaza**: La app reintenta y duplica pagos.

**Riesgo**: Historial incorrecto, números inflados.

**✅ Defensas**:
- Idempotencia con `operationId` único
- Backend: si el `operationId` ya existe, responde OK sin duplicar
- Confirmación "Guardado" solo con respuesta server

**Implementación**:
```javascript
// Verificar idempotencia
if (operationId) {
  const opDoc = await db.collection('operations').doc(operationId).get();
  if (opDoc.exists) {
    return { success: true, alreadyProcessed: true };
  }
}

// Guardar operación
await db.collection('operations').doc(operationId).set({
  type: 'pay_installment',
  installmentId,
  processedAt: admin.firestore.FieldValue.serverTimestamp(),
});
```

---

### 7. Pagos/renovaciones falsos desde frontend (APK modificado)

**Amenaza**: Modificar app para enviar `pagado=true`.

**Riesgo**: Datos falsos.

**✅ Defensas**:
- Acciones críticas SOLO por Cloud Functions:
  - Pagar cuota
  - Renovar cuota
  - Saldar total
  - Crear cuotas
- Backend valida estado actual y reglas
- Auditoría por workerId
- App Check verifica integridad de la app

**Firestore Rules**:
```javascript
match /installments/{installmentId} {
  // Actualizar: SOLO por Cloud Function
  allow update: if false;
}
```

---

### 8. Robo de sesión / dispositivo compartido

**Amenaza**: Alguien usa el teléfono de otro worker.

**Riesgo**: Operaciones no autorizadas.

**✅ Defensas**:
- "Perfil interno de trabajador" al entrar
- PIN del worker (opcional, no 2FA)
- Logs por workerId
- Admin puede desactivar worker
- Timeout de sesión

---

### 9. Exposición de datos sensibles (CPF)

**Amenaza**: Filtración o acceso indebido.

**Riesgo**: Problema legal (LGPD).

**✅ Defensas**:
- Permisos por rol y por cartera
- CPF parcialmente oculto en UI (`***.***.123-45`)
- Auditoría de accesos
- Exportes controlados solo admin
- Política de retención/borrado

**Implementación**:
```dart
// ClientModel
String get maskedCpf {
  if (cpf.length < 11) return cpf;
  return '***.***.${cpf.substring(6, 9)}-${cpf.substring(9)}';
}
```

---

### 10. Borrado accidental o malicioso

**Amenaza**: Borrar clientes/deudas/pagos.

**Riesgo**: Pérdida de información.

**✅ Defensas**:
- Soft delete (cambiar `isActive` a `false`)
- Papelera de reciclaje
- Restauración desde papelera
- Backups diarios + restore como "clon"
- Logs de borrados

**Firestore Rules**:
```javascript
// Eliminar: nunca (soft delete)
allow delete: if false;
```

---

### 11. Sistema "se cae" (functions down / internet down)

**Amenaza**: La app no guarda o se queda inconsistente.

**Riesgo**: Pérdida operativa.

**✅ Defensas**:
- Modo "sin conexión" con bloqueo de acciones críticas
- Cola de reintentos
- Mensajes claros al usuario
- Backups automáticos
- Monitoreo Crashlytics + logs
- Verificación de conectividad antes de acciones críticas

---

### 12. Ataque por carga (DDoS suave)

**Amenaza**: Saturar endpoints.

**Riesgo**: Costos y caída.

**✅ Defensas**:
- Rate limit global y por endpoint
- App Check
- Paginación e índices en Firestore
- Caching de estadísticas
- Límites de Firebase (automáticos)

---

## 🔐 Implementaciones de Seguridad

### App Check

```dart
// main.dart
await FirebaseAppCheck.instance.activate(
  androidProvider: AndroidProvider.playIntegrity,
  appleProvider: AppleProvider.appAttest,
);
```

### Rate Limiting

Configurado en Firebase Console > App Check:
- Login: 5 intentos/minuto
- Unlock wallet: 3 intentos/minuto
- Pay installment: 10 intentos/minuto
- Create loan: 5 intentos/minuto

### Auditoría

Todas las acciones críticas se registran:

```javascript
const logAudit = async (action, userId, workerId, walletId, details = {}) => {
  await db.collection('audit_logs').add({
    action,
    userId,
    workerId,
    walletId,
    details,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    serverTime: getServerTime().toISOString(),
  });
};
```

### Idempotencia

```dart
// Generar operationId único
final operationId = '${userId}_${action}_${timestamp}_${uuid}';

// Enviar a Cloud Function
await functions.httpsCallable('payInstallment').call({
  'installmentId': installmentId,
  'workerId': workerId,
  'operationId': operationId,
});
```

### Soft Delete

```dart
// En lugar de eliminar
await clientRef.update({'isActive': false});

// Restaurar
await clientRef.update({'isActive': true});
```

---

## ✅ Checklist de Seguridad

### Configuración

- [x] Firebase App Check activado
- [x] Firestore Rules desplegadas
- [x] Cloud Functions con validaciones
- [x] Admin whitelist configurado
- [x] Rate limiting configurado
- [x] Auditoría implementada
- [x] Idempotencia en operaciones críticas
- [x] Server timestamps en todo
- [x] Soft delete implementado
- [x] Backups automáticos

### Testing

- [ ] Probar fuerza bruta de login
- [ ] Probar fuerza bruta de carteras
- [ ] Probar modificación de APK
- [ ] Probar manipulación de tiempo
- [ ] Probar duplicación de pagos
- [ ] Probar escalada de privilegios
- [ ] Probar acceso sin permisos
- [ ] Probar sin conexión
- [ ] Probar rate limiting
- [ ] Probar restauración de backups

### Monitoreo

- [ ] Crashlytics configurado
- [ ] Logs de Functions activos
- [ ] Alertas de seguridad configuradas
- [ ] Auditoría revisada regularmente
- [ ] Backups verificados

---

## 🚨 Respuesta a Incidentes

### Si detectas actividad sospechosa:

1. **Revisar logs de auditoría**
   ```bash
   firebase firestore:query audit_logs --where "timestamp > $(date -d '1 hour ago' +%s)"
   ```

2. **Bloquear usuario**
   ```javascript
   await db.collection('users').doc(userId).update({
     isActive: false
   });
   ```

3. **Revisar accesos a carteras**
   ```javascript
   const logs = await db.collection('audit_logs')
     .where('action', '==', 'wallet_unlocked')
     .where('userId', '==', suspiciousUserId)
     .get();
   ```

4. **Restaurar desde backup si es necesario**

5. **Cambiar contraseñas de carteras afectadas**

6. **Notificar al admin**

---

## 📞 Contacto de Seguridad

Para reportar vulnerabilidades:
- Email: security@finangest.com
- No publicar vulnerabilidades públicamente
- Esperar respuesta antes de divulgar

---

## 📚 Referencias

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [App Check](https://firebase.google.com/docs/app-check)
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)
- [LGPD Brasil](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
