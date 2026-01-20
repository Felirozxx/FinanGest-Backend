import 'package:cloud_firestore/cloud_firestore.dart';

class ClientModel {
  final String id;
  final String walletId; // Cartera a la que pertenece
  final String name;
  final String cpf;
  final String location;
  final String businessType;
  final String phone;
  final String microInsurance; // Campo informativo
  final DateTime createdAt;
  final String createdBy; // workerId
  final bool isActive;
  
  ClientModel({
    required this.id,
    required this.walletId,
    required this.name,
    required this.cpf,
    required this.location,
    required this.businessType,
    required this.phone,
    this.microInsurance = '',
    required this.createdAt,
    required this.createdBy,
    this.isActive = true,
  });
  
  // CPF parcialmente oculto (para privacidad)
  String get maskedCpf {
    if (cpf.length < 11) return cpf;
    return '***.***.${cpf.substring(6, 9)}-${cpf.substring(9)}';
  }
  
  // Desde Firestore
  factory ClientModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ClientModel(
      id: doc.id,
      walletId: data['walletId'] ?? '',
      name: data['name'] ?? '',
      cpf: data['cpf'] ?? '',
      location: data['location'] ?? '',
      businessType: data['businessType'] ?? '',
      phone: data['phone'] ?? '',
      microInsurance: data['microInsurance'] ?? '',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      createdBy: data['createdBy'] ?? '',
      isActive: data['isActive'] ?? true,
    );
  }
  
  // A Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'walletId': walletId,
      'name': name,
      'cpf': cpf,
      'location': location,
      'businessType': businessType,
      'phone': phone,
      'microInsurance': microInsurance,
      'createdAt': Timestamp.fromDate(createdAt),
      'createdBy': createdBy,
      'isActive': isActive,
    };
  }
  
  // Copiar con cambios
  ClientModel copyWith({
    String? name,
    String? cpf,
    String? location,
    String? businessType,
    String? phone,
    String? microInsurance,
    bool? isActive,
  }) {
    return ClientModel(
      id: id,
      walletId: walletId,
      name: name ?? this.name,
      cpf: cpf ?? this.cpf,
      location: location ?? this.location,
      businessType: businessType ?? this.businessType,
      phone: phone ?? this.phone,
      microInsurance: microInsurance ?? this.microInsurance,
      createdAt: createdAt,
      createdBy: createdBy,
      isActive: isActive ?? this.isActive,
    );
  }
}
