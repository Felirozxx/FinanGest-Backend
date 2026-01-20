import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/loan_model.dart';
import '../models/installment_model.dart';

class LoanProvider with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  List<LoanModel> _loans = [];
  List<InstallmentModel> _installments = [];
  bool _isLoading = false;
  
  List<LoanModel> get loans => _loans;
  List<InstallmentModel> get installments => _installments;
  bool get isLoading => _isLoading;
  
  Future<void> loadLoans(String walletId) async {
    try {
      _isLoading = true;
      notifyListeners();
      
      final snapshot = await _firestore
          .collection('loans')
          .where('walletId', isEqualTo: walletId)
          .orderBy('createdAt', descending: true)
          .get();
      
      _loans = snapshot.docs
          .map((doc) => LoanModel.fromFirestore(doc))
          .toList();
    } catch (e) {
      debugPrint('Error loading loans: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<void> createLoan(Map<String, dynamic> loanData) async {
    try {
      _isLoading = true;
      notifyListeners();
      
      // Crear préstamo directamente en Firestore
      final loanRef = _firestore.collection('loans').doc();
      
      await loanRef.set({
        ...loanData,
        'createdAt': FieldValue.serverTimestamp(),
        'status': 'active',
      });
      
      // Recargar préstamos
      await loadLoans(loanData['walletId']);
    } catch (e) {
      debugPrint('Error creating loan: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<void> payInstallment(String installmentId, String workerId) async {
    try {
      _isLoading = true;
      notifyListeners();
      
      // Marcar cuota como pagada directamente
      await _firestore.collection('installments').doc(installmentId).update({
        'status': 'paid',
        'paidAt': FieldValue.serverTimestamp(),
        'paidBy': workerId,
      });
      
      notifyListeners();
    } catch (e) {
      debugPrint('Error paying installment: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
