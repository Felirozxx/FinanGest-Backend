import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:async';

class SystemScheduleProvider with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  bool _isSystemOpen = true;
  DateTime? _lastCheckDate;
  Timer? _scheduleTimer;
  
  bool get isSystemOpen => _isSystemOpen;
  DateTime? get lastCheckDate => _lastCheckDate;
  
  SystemScheduleProvider() {
    _initializeSchedule();
  }
  
  void _initializeSchedule() {
    // Verificar estado inicial
    _checkSystemStatus();
    
    // Verificar cada minuto
    _scheduleTimer = Timer.periodic(const Duration(minutes: 1), (timer) {
      _checkSystemStatus();
    });
  }
  
  Future<void> _checkSystemStatus() async {
    try {
      // Obtener hora actual en zona horaria de Brasilia (UTC-3)
      final now = DateTime.now().toUtc().subtract(const Duration(hours: 3));
      final currentHour = now.hour;
      final currentDate = DateTime(now.year, now.month, now.day);
      
      // Sistema abierto: 6:00 AM - 11:59 PM (Brasilia)
      final shouldBeOpen = currentHour >= 6 && currentHour < 24;
      
      // Si cambió el estado
      if (_isSystemOpen != shouldBeOpen) {
        _isSystemOpen = shouldBeOpen;
        
        if (!shouldBeOpen) {
          // Sistema se cerró (medianoche)
          await _performDailyClose(currentDate);
        } else {
          // Sistema se abrió (6 AM)
          await _performDailyOpen(currentDate);
        }
        
        notifyListeners();
      }
      
      // Si cambió el día, actualizar
      if (_lastCheckDate == null || _lastCheckDate != currentDate) {
        _lastCheckDate = currentDate;
        notifyListeners();
      }
      
    } catch (e) {
      debugPrint('Error checking system status: $e');
    }
  }
  
  Future<void> _performDailyClose(DateTime date) async {
    try {
      debugPrint('🌙 SISTEMA CERRADO - ${date.toString()}');
      
      // Guardar registro de cierre
      await _firestore.collection('system_logs').add({
        'type': 'daily_close',
        'date': Timestamp.fromDate(date),
        'timestamp': FieldValue.serverTimestamp(),
        'status': 'closed',
      });
      
      // Marcar cuotas vencidas hasta hoy
      await _markOverdueInstallments(date);
      
    } catch (e) {
      debugPrint('Error performing daily close: $e');
    }
  }
  
  Future<void> _performDailyOpen(DateTime date) async {
    try {
      debugPrint('🌅 SISTEMA ABIERTO - ${date.toString()}');
      
      // Guardar registro de apertura
      await _firestore.collection('system_logs').add({
        'type': 'daily_open',
        'date': Timestamp.fromDate(date),
        'timestamp': FieldValue.serverTimestamp(),
        'status': 'open',
      });
      
    } catch (e) {
      debugPrint('Error performing daily open: $e');
    }
  }
  
  Future<void> _markOverdueInstallments(DateTime currentDate) async {
    try {
      // Buscar cuotas pendientes con fecha de vencimiento anterior a hoy
      final overdueSnapshot = await _firestore
          .collection('installments')
          .where('status', isEqualTo: 'pending')
          .where('dueDate', isLessThan: Timestamp.fromDate(currentDate))
          .get();
      
      // Marcar como vencidas
      final batch = _firestore.batch();
      for (var doc in overdueSnapshot.docs) {
        batch.update(doc.reference, {
          'status': 'overdue',
          'updatedAt': FieldValue.serverTimestamp(),
        });
      }
      
      if (overdueSnapshot.docs.isNotEmpty) {
        await batch.commit();
        debugPrint('✅ ${overdueSnapshot.docs.length} cuotas marcadas como vencidas');
      }
      
    } catch (e) {
      debugPrint('Error marking overdue installments: $e');
    }
  }
  
  String getSystemStatusMessage() {
    if (_isSystemOpen) {
      return 'Sistema Abierto - Operaciones permitidas';
    } else {
      return 'Sistema Cerrado - Solo lectura hasta las 6:00 AM';
    }
  }
  
  String getSystemStatusEmoji() {
    return _isSystemOpen ? '🟢' : '🔴';
  }
  
  @override
  void dispose() {
    _scheduleTimer?.cancel();
    super.dispose();
  }
}
