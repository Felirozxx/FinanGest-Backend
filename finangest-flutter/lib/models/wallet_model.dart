import 'package:cloud_firestore/cloud_firestore.dart';

class WalletModel {
  final String id;
  final String name;
  final String passwordHash; // NUNCA la contraseña en texto plano
  final DateTime createdAt;
  final String createdBy; // uid del admin que la creó
  final bool isActive;
  final int failedAttempts; // Contador de intentos fallidos
  final DateTime? lockedUntil; // Bloqueada hasta esta fecha
  
  WalletModel({
    required this.id,
    required this.name,
    required this.passwordHash,
    required this.createdAt,
    required this.createdBy,
    this.isActive = true,
    this.failedAttempts = 0,
    this.lockedUntil,
  });
  
  // Verificar si está bloqueada
  bool get isLocked {
    if (lockedUntil == null) return false;
    return DateTime.now().isBefore(lockedUntil!);
  }
  
  // Desde Firestore
  factory WalletModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return WalletModel(
      id: doc.id,
      name: data['name'] ?? '',
      passwordHash: data['passwordHash'] ?? '',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      createdBy: data['createdBy'] ?? '',
      isActive: data['isActive'] ?? true,
      failedAttempts: data['failedAttempts'] ?? 0,
      lockedUntil: data['lockedUntil'] != null 
          ? (data['lockedUntil'] as Timestamp).toDate() 
          : null,
    );
  }
  
  // A Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'name': name,
      'passwordHash': passwordHash,
      'createdAt': Timestamp.fromDate(createdAt),
      'createdBy': createdBy,
      'isActive': isActive,
      'failedAttempts': failedAttempts,
      'lockedUntil': lockedUntil != null 
          ? Timestamp.fromDate(lockedUntil!) 
          : null,
    };
  }
  
  // Copiar con cambios
  WalletModel copyWith({
    String? name,
    bool? isActive,
    int? failedAttempts,
    DateTime? lockedUntil,
  }) {
    return WalletModel(
      id: id,
      name: name ?? this.name,
      passwordHash: passwordHash,
      createdAt: createdAt,
      createdBy: createdBy,
      isActive: isActive ?? this.isActive,
      failedAttempts: failedAttempts ?? this.failedAttempts,
      lockedUntil: lockedUntil,
    );
  }
}
