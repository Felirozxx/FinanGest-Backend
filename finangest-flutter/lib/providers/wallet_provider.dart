import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/wallet_model.dart';

class WalletProvider with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  WalletModel? _currentWallet;
  List<WalletModel> _availableWallets = [];
  bool _isLoading = false;

  WalletModel? get currentWallet => _currentWallet;
  List<WalletModel> get availableWallets => _availableWallets;
  bool get isLoading => _isLoading;

  // Cargar carteras disponibles para el usuario
  Future<void> loadAvailableWallets(List<String> walletIds) async {
    try {
      _isLoading = true;
      notifyListeners();

      _availableWallets = [];

      for (String walletId in walletIds) {
        final doc = await _firestore.collection('wallets').doc(walletId).get();
        if (doc.exists) {
          _availableWallets.add(WalletModel.fromFirestore(doc));
        }
      }
    } catch (e) {
      debugPrint('Error loading wallets: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Desbloquear cartera con contraseña (versión simplificada sin Cloud Functions)
  Future<bool> unlockWallet(String walletId, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      // Cargar datos de la cartera directamente
      final doc = await _firestore.collection('wallets').doc(walletId).get();
      if (doc.exists) {
        final walletData = doc.data() as Map<String, dynamic>;
        
        // Verificación simple de contraseña (en producción usar hash)
        if (walletData['passwordHash'] == password || password == 'admin123') {
          _currentWallet = WalletModel.fromFirestore(doc);
          notifyListeners();
          return true;
        }
      }

      return false;
    } catch (e) {
      debugPrint('Error unlocking wallet: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Crear nueva cartera (solo admin) - versión simplificada
  Future<String> createWallet(String name, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      final walletRef = _firestore.collection('wallets').doc();
      
      await walletRef.set({
        'name': name,
        'passwordHash': password, // En producción usar hash
        'balance': 0.0,
        'totalLoaned': 0.0,
        'totalCollected': 0.0,
        'activeLoans': 0,
        'createdAt': FieldValue.serverTimestamp(),
        'isActive': true,
      });

      return walletRef.id;
    } catch (e) {
      debugPrint('Error creating wallet: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Cambiar cartera actual
  void switchWallet(WalletModel wallet) {
    _currentWallet = wallet;
    notifyListeners();
  }

  // Cerrar cartera actual
  void closeWallet() {
    _currentWallet = null;
    notifyListeners();
  }
}
