import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/client_model.dart';

class ClientProvider with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  List<ClientModel> _clients = [];
  bool _isLoading = false;
  
  List<ClientModel> get clients => _clients;
  bool get isLoading => _isLoading;
  
  Future<void> loadClients(String walletId) async {
    try {
      _isLoading = true;
      notifyListeners();
      
      final snapshot = await _firestore
          .collection('clients')
          .where('walletId', isEqualTo: walletId)
          .where('isActive', isEqualTo: true)
          .orderBy('name')
          .get();
      
      _clients = snapshot.docs
          .map((doc) => ClientModel.fromFirestore(doc))
          .toList();
    } catch (e) {
      debugPrint('Error loading clients: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<void> createClient(ClientModel client) async {
    try {
      await _firestore.collection('clients').add(client.toFirestore());
      notifyListeners();
    } catch (e) {
      debugPrint('Error creating client: $e');
      rethrow;
    }
  }
}
