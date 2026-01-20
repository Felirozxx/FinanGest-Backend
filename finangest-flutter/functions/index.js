const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');

admin.initializeApp();
const db = admin.firestore();

// Configuración
const TIMEZONE = 'America/Sao_Paulo'; // Brasilia (Brasil)
const ADMIN_WHITELIST = ['fzuluaga548@gmail.com', 'finangestsoftware@gmail.com']; // Emails admin
const MAX_ATTEMPTS = 10;
const LOCKOUT_MINUTES = 5;

// ============================================
// UTILIDADES
// ============================================

// Obtener hora del servidor
const getServerTime = () => {
  return moment().tz(TIMEZONE);
};

// Verificar si el sistema está abierto (06:00 - 00:00)
const isSystemOpen = () => {
  const now = getServerTime();
  const hour = now.hour();
  return hour >= 6 && hour < 24;
};

// Auditoría
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

// ============================================
// AUTENTICACIÓN Y USUARIOS
// ============================================

// Crear usuario (trigger)
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  const isAdmin = ADMIN_WHITELIST.includes(user.email);
  
  await db.collection('users').doc(user.uid).set({
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    role: isAdmin ? 'admin' : 'worker',
    availableWallets: [],
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLogin: null,
    authorizedDevices: [],
  });
  
  await logAudit('user_created', user.uid, null, null, {
    email: user.email,
    role: isAdmin ? 'admin' : 'worker',
  });
});

// Actualizar último login
exports.updateLastLogin = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  await db.collection('users').doc(context.auth.uid).update({
    lastLogin: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { success: true };
});

// ============================================
// CARTERAS (WALLETS)
// ============================================

// Crear cartera (solo admin)
exports.createWallet = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { name, password } = data;
  
  if (!name || !password) {
    throw new functions.https.HttpsError('invalid-argument', 'Nombre y contraseña requeridos');
  }
  
  // Verificar que es admin
  const userDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Solo admin puede crear carteras');
  }
  
  // Hash de la contraseña
  const passwordHash = await bcrypt.hash(password, 12);
  
  const walletRef = await db.collection('wallets').add({
    name,
    passwordHash,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: context.auth.uid,
    isActive: true,
    failedAttempts: 0,
    lockedUntil: null,
  });
  
  await logAudit('wallet_created', context.auth.uid, null, walletRef.id, { name });
  
  return { success: true, walletId: walletRef.id };
});

// Desbloquear cartera (verificar contraseña)
exports.unlockWallet = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { walletId, password } = data;
  
  if (!walletId || !password) {
    throw new functions.https.HttpsError('invalid-argument', 'WalletId y contraseña requeridos');
  }
  
  const walletRef = db.collection('wallets').doc(walletId);
  const walletDoc = await walletRef.get();
  
  if (!walletDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Cartera no encontrada');
  }
  
  const wallet = walletDoc.data();
  
  // Verificar si está bloqueada
  if (wallet.lockedUntil && wallet.lockedUntil.toDate() > new Date()) {
    const minutesLeft = Math.ceil((wallet.lockedUntil.toDate() - new Date()) / 60000);
    throw new functions.https.HttpsError(
      'permission-denied',
      `Cartera bloqueada. Intenta en ${minutesLeft} minutos`
    );
  }
  
  // Verificar contraseña
  const isValid = await bcrypt.compare(password, wallet.passwordHash);
  
  if (!isValid) {
    const newAttempts = (wallet.failedAttempts || 0) + 1;
    const updates = { failedAttempts: newAttempts };
    
    // Bloquear si alcanza el máximo
    if (newAttempts >= MAX_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60000);
      updates.lockedUntil = admin.firestore.Timestamp.fromDate(lockUntil);
      updates.failedAttempts = 0;
      
      await logAudit('wallet_locked', context.auth.uid, null, walletId, {
        reason: 'max_attempts',
      });
    }
    
    await walletRef.update(updates);
    
    throw new functions.https.HttpsError(
      'permission-denied',
      `Contraseña incorrecta. Intentos: ${newAttempts}/${MAX_ATTEMPTS}`
    );
  }
  
  // Contraseña correcta - resetear intentos
  await walletRef.update({
    failedAttempts: 0,
    lockedUntil: null,
  });
  
  await logAudit('wallet_unlocked', context.auth.uid, null, walletId);
  
  return { success: true };
});

// ============================================
// PRÉSTAMOS Y CUOTAS
// ============================================

// Crear préstamo y generar cuotas automáticamente
exports.createLoan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  if (!isSystemOpen()) {
    throw new functions.https.HttpsError('failed-precondition', 'Sistema cerrado');
  }
  
  const {
    clientId,
    walletId,
    workerId,
    totalAmount,
    numberOfInstallments,
    frequency,
    firstDueDate,
  } = data;
  
  // Validaciones
  if (!clientId || !walletId || !totalAmount || !numberOfInstallments || !frequency) {
    throw new functions.https.HttpsError('invalid-argument', 'Datos incompletos');
  }
  
  const installmentAmount = totalAmount / numberOfInstallments;
  
  // Crear préstamo
  const loanRef = await db.collection('loans').add({
    clientId,
    walletId,
    totalAmount,
    numberOfInstallments,
    frequency,
    firstDueDate: admin.firestore.Timestamp.fromDate(new Date(firstDueDate)),
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: workerId || context.auth.uid,
    paidAmount: 0,
    remainingAmount: totalAmount,
  });
  
  // Generar cuotas automáticamente
  const batch = db.batch();
  let currentDueDate = moment(firstDueDate).tz(TIMEZONE);
  
  for (let i = 1; i <= numberOfInstallments; i++) {
    const installmentRef = db.collection('installments').doc();
    
    batch.set(installmentRef, {
      loanId: loanRef.id,
      clientId,
      walletId,
      installmentNumber: i,
      amount: installmentAmount,
      dueDate: admin.firestore.Timestamp.fromDate(currentDueDate.toDate()),
      status: 'pending',
      paidDate: null,
      paidBy: null,
      renewCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Calcular siguiente fecha según frecuencia
    switch (frequency) {
      case 'weekly':
        currentDueDate.add(7, 'days');
        break;
      case 'biweekly':
        currentDueDate.add(14, 'days');
        break;
      case 'monthly':
        currentDueDate.add(1, 'month');
        break;
    }
  }
  
  await batch.commit();
  
  await logAudit('loan_created', context.auth.uid, workerId, walletId, {
    loanId: loanRef.id,
    clientId,
    totalAmount,
    numberOfInstallments,
  });
  
  return { success: true, loanId: loanRef.id };
});

// Pagar cuota
exports.payInstallment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  if (!isSystemOpen()) {
    throw new functions.https.HttpsError('failed-precondition', 'Sistema cerrado');
  }
  
  const { installmentId, workerId, operationId } = data;
  
  if (!installmentId) {
    throw new functions.https.HttpsError('invalid-argument', 'InstallmentId requerido');
  }
  
  // Idempotencia - verificar si ya se procesó
  if (operationId) {
    const opDoc = await db.collection('operations').doc(operationId).get();
    if (opDoc.exists) {
      return { success: true, alreadyProcessed: true };
    }
  }
  
  const installmentRef = db.collection('installments').doc(installmentId);
  const installmentDoc = await installmentRef.get();
  
  if (!installmentDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Cuota no encontrada');
  }
  
  const installment = installmentDoc.data();
  
  if (installment.status === 'paid') {
    throw new functions.https.HttpsError('already-exists', 'Cuota ya pagada');
  }
  
  // Actualizar cuota
  await installmentRef.update({
    status: 'paid',
    paidDate: admin.firestore.FieldValue.serverTimestamp(),
    paidBy: workerId || context.auth.uid,
  });
  
  // Actualizar préstamo
  const loanRef = db.collection('loans').doc(installment.loanId);
  await loanRef.update({
    paidAmount: admin.firestore.FieldValue.increment(installment.amount),
    remainingAmount: admin.firestore.FieldValue.increment(-installment.amount),
  });
  
  // Crear evento verde 🟩
  await db.collection('events').add({
    type: 'payment',
    color: 'green',
    clientId: installment.clientId,
    loanId: installment.loanId,
    installmentId,
    amount: installment.amount,
    workerId: workerId || context.auth.uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Guardar operación para idempotencia
  if (operationId) {
    await db.collection('operations').doc(operationId).set({
      type: 'pay_installment',
      installmentId,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  await logAudit('installment_paid', context.auth.uid, workerId, installment.walletId, {
    installmentId,
    amount: installment.amount,
  });
  
  return { success: true };
});

// Renovar cuota
exports.renewInstallment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  if (!isSystemOpen()) {
    throw new functions.https.HttpsError('failed-precondition', 'Sistema cerrado');
  }
  
  const { installmentId, newDueDate, workerId, operationId } = data;
  
  if (!installmentId || !newDueDate) {
    throw new functions.https.HttpsError('invalid-argument', 'Datos incompletos');
  }
  
  // Idempotencia
  if (operationId) {
    const opDoc = await db.collection('operations').doc(operationId).get();
    if (opDoc.exists) {
      return { success: true, alreadyProcessed: true };
    }
  }
  
  const installmentRef = db.collection('installments').doc(installmentId);
  const installmentDoc = await installmentRef.get();
  
  if (!installmentDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Cuota no encontrada');
  }
  
  const installment = installmentDoc.data();
  
  // Actualizar cuota
  await installmentRef.update({
    dueDate: admin.firestore.Timestamp.fromDate(new Date(newDueDate)),
    renewCount: admin.firestore.FieldValue.increment(1),
    status: 'pending', // Vuelve a pending si estaba overdue
  });
  
  // Crear evento de renovación
  await db.collection('events').add({
    type: 'renewal',
    color: 'blue',
    clientId: installment.clientId,
    loanId: installment.loanId,
    installmentId,
    oldDueDate: installment.dueDate,
    newDueDate: admin.firestore.Timestamp.fromDate(new Date(newDueDate)),
    workerId: workerId || context.auth.uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Guardar operación
  if (operationId) {
    await db.collection('operations').doc(operationId).set({
      type: 'renew_installment',
      installmentId,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  await logAudit('installment_renewed', context.auth.uid, workerId, installment.walletId, {
    installmentId,
    newDueDate,
  });
  
  return { success: true };
});

// Pagar todo (saldar préstamo completo)
exports.payAllInstallments = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  if (!isSystemOpen()) {
    throw new functions.https.HttpsError('failed-precondition', 'Sistema cerrado');
  }
  
  const { loanId, workerId, operationId } = data;
  
  if (!loanId) {
    throw new functions.https.HttpsError('invalid-argument', 'LoanId requerido');
  }
  
  // Idempotencia
  if (operationId) {
    const opDoc = await db.collection('operations').doc(operationId).get();
    if (opDoc.exists) {
      return { success: true, alreadyProcessed: true };
    }
  }
  
  const loanRef = db.collection('loans').doc(loanId);
  const loanDoc = await loanRef.get();
  
  if (!loanDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Préstamo no encontrado');
  }
  
  const loan = loanDoc.data();
  
  // Obtener todas las cuotas pendientes
  const installmentsSnapshot = await db.collection('installments')
    .where('loanId', '==', loanId)
    .where('status', '!=', 'paid')
    .get();
  
  const batch = db.batch();
  
  // Marcar todas como pagadas
  installmentsSnapshot.forEach(doc => {
    batch.update(doc.ref, {
      status: 'paid',
      paidDate: admin.firestore.FieldValue.serverTimestamp(),
      paidBy: workerId || context.auth.uid,
    });
  });
  
  // Actualizar préstamo
  batch.update(loanRef, {
    status: 'settled',
    paidAmount: loan.totalAmount,
    remainingAmount: 0,
  });
  
  await batch.commit();
  
  // Crear evento morado 🟪
  await db.collection('events').add({
    type: 'settled',
    color: 'purple',
    clientId: loan.clientId,
    loanId,
    totalAmount: loan.totalAmount,
    workerId: workerId || context.auth.uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Guardar operación
  if (operationId) {
    await db.collection('operations').doc(operationId).set({
      type: 'pay_all',
      loanId,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  await logAudit('loan_settled', context.auth.uid, workerId, loan.walletId, {
    loanId,
    totalAmount: loan.totalAmount,
  });
  
  return { success: true };
});

// ============================================
// ATRASOS AUTOMÁTICOS (Scheduled Function)
// ============================================

// Ejecutar diariamente a las 00:01
exports.checkOverdueInstallments = functions.pubsub
  .schedule('1 0 * * *')
  .timeZone(TIMEZONE)
  .onRun(async (context) => {
    const now = getServerTime();
    
    // Buscar cuotas pendientes con fecha vencida
    const overdueSnapshot = await db.collection('installments')
      .where('status', '==', 'pending')
      .where('dueDate', '<', admin.firestore.Timestamp.fromDate(now.toDate()))
      .get();
    
    const batch = db.batch();
    const events = [];
    
    overdueSnapshot.forEach(doc => {
      const installment = doc.data();
      
      // Marcar como atrasada
      batch.update(doc.ref, {
        status: 'overdue',
      });
      
      // Crear evento rojo 🟥
      events.push({
        type: 'overdue',
        color: 'red',
        clientId: installment.clientId,
        loanId: installment.loanId,
        installmentId: doc.id,
        dueDate: installment.dueDate,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    
    await batch.commit();
    
    // Guardar eventos
    for (const event of events) {
      await db.collection('events').add(event);
    }
    
    console.log(`Marcadas ${overdueSnapshot.size} cuotas como atrasadas`);
    
    return null;
  });

// ============================================
// CIERRE Y APERTURA DIARIA
// ============================================

// Cierre automático a las 00:00
exports.dailyClose = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone(TIMEZONE)
  .onRun(async (context) => {
    const today = getServerTime().format('YYYY-MM-DD');
    
    await db.collection('system_status').doc('current').set({
      isOpen: false,
      lastClosed: admin.firestore.FieldValue.serverTimestamp(),
      currentDate: today,
    });
    
    console.log(`Sistema cerrado: ${today}`);
    
    return null;
  });

// Apertura automática a las 06:00
exports.dailyOpen = functions.pubsub
  .schedule('0 6 * * *')
  .timeZone(TIMEZONE)
  .onRun(async (context) => {
    const today = getServerTime().format('YYYY-MM-DD');
    
    await db.collection('system_status').doc('current').set({
      isOpen: true,
      lastOpened: admin.firestore.FieldValue.serverTimestamp(),
      currentDate: today,
    });
    
    console.log(`Sistema abierto: ${today}`);
    
    return null;
  });
