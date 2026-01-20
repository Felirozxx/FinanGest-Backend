import 'package:cloud_firestore/cloud_firestore.dart';

enum UserRole { admin, worker }

class UserModel {
  final String uid;
  final String email;
  final String displayName;
  final UserRole role;
  final List<String> availableWallets; // IDs de carteras disponibles
  final bool isActive;
  final DateTime createdAt;
  final DateTime? lastLogin;
  final List<String> authorizedDevices; // Para admin
  
  UserModel({
    required this.uid,
    required this.email,
    required this.displayName,
    required this.role,
    required this.availableWallets,
    this.isActive = true,
    required this.createdAt,
    this.lastLogin,
    this.authorizedDevices = const [],
  });
  
  // Verificar si es admin
  bool get isAdmin => role == UserRole.admin;
  
  // Verificar si tiene acceso a una cartera
  bool hasAccessToWallet(String walletId) {
    return isAdmin || availableWallets.contains(walletId);
  }
  
  // Desde Firestore
  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel(
      uid: doc.id,
      email: data['email'] ?? '',
      displayName: data['displayName'] ?? '',
      role: data['role'] == 'admin' ? UserRole.admin : UserRole.worker,
      availableWallets: List<String>.from(data['availableWallets'] ?? []),
      isActive: data['isActive'] ?? true,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      lastLogin: data['lastLogin'] != null 
          ? (data['lastLogin'] as Timestamp).toDate() 
          : null,
      authorizedDevices: List<String>.from(data['authorizedDevices'] ?? []),
    );
  }
  
  // A Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'email': email,
      'displayName': displayName,
      'role': role == UserRole.admin ? 'admin' : 'worker',
      'availableWallets': availableWallets,
      'isActive': isActive,
      'createdAt': Timestamp.fromDate(createdAt),
      'lastLogin': lastLogin != null ? Timestamp.fromDate(lastLogin!) : null,
      'authorizedDevices': authorizedDevices,
    };
  }
  
  // Copiar con cambios
  UserModel copyWith({
    String? displayName,
    UserRole? role,
    List<String>? availableWallets,
    bool? isActive,
    DateTime? lastLogin,
    List<String>? authorizedDevices,
  }) {
    return UserModel(
      uid: uid,
      email: email,
      displayName: displayName ?? this.displayName,
      role: role ?? this.role,
      availableWallets: availableWallets ?? this.availableWallets,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt,
      lastLogin: lastLogin ?? this.lastLogin,
      authorizedDevices: authorizedDevices ?? this.authorizedDevices,
    );
  }
}
