import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class StatsProvider with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  Map<String, dynamic> _dailyStats = {};
  bool _isLoading = false;
  
  Map<String, dynamic> get dailyStats => _dailyStats;
  bool get isLoading => _isLoading;
  
  Future<void> loadDailyStats() async {
    try {
      _isLoading = true;
      notifyListeners();
      
      // Cargar estadísticas del día actual
      final today = DateTime.now();
      final dateStr = '${today.year}-${today.month.toString().padLeft(2, '0')}-${today.day.toString().padLeft(2, '0')}';
      
      final doc = await _firestore
          .collection('daily_stats')
          .doc(dateStr)
          .get();
      
      if (doc.exists) {
        _dailyStats = doc.data() ?? {};
      }
    } catch (e) {
      debugPrint('Error loading stats: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
