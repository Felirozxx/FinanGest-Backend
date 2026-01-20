import 'package:cloud_firestore/cloud_firestore.dart';

enum InstallmentStatus { pending, paid, overdue }

class InstallmentModel {
  final String id;
  final String loanId;
  final String clientId;
  final String walletId;
  final int installmentNumber; // #1, #2, #3...
  final double amount;
  final DateTime dueDate; // Fecha de vencimiento
  final InstallmentStatus status;
  final DateTime? paidDate; // Fecha de pago (server timestamp)
  final String? paidBy; // workerId que registró el pago
  final int renewCount; // Número de veces renovada
  final DateTime createdAt;
  
  InstallmentModel({
    required this.id,
    required this.loanId,
    required this.clientId,
    required this.walletId,
    required this.installmentNumber,
    required this.amount,
    required this.dueDate,
    this.status = InstallmentStatus.pending,
    this.paidDate,
    this.paidBy,
    this.renewCount = 0,
    required this.createdAt,
  });
  
  // Verificar si está atrasada (calculado por servidor)
  bool get isOverdue => status == InstallmentStatus.overdue;
  
  // Verificar si está pagada
  bool get isPaid => status == InstallmentStatus.paid;
  
  // Días de atraso (solo si está atrasada)
  int get daysOverdue {
    if (!isOverdue) return 0;
    return DateTime.now().difference(dueDate).inDays;
  }
  
  // Color según estado (🟩 🟥 🟪)
  InstallmentColor get color {
    if (isPaid) return InstallmentColor.green;
    if (isOverdue) return InstallmentColor.red;
    return InstallmentColor.pending;
  }
  
  // Desde Firestore
  factory InstallmentModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return InstallmentModel(
      id: doc.id,
      loanId: data['loanId'] ?? '',
      clientId: data['clientId'] ?? '',
      walletId: data['walletId'] ?? '',
      installmentNumber: data['installmentNumber'] ?? 0,
      amount: (data['amount'] ?? 0).toDouble(),
      dueDate: (data['dueDate'] as Timestamp).toDate(),
      status: _statusFromString(data['status']),
      paidDate: data['paidDate'] != null 
          ? (data['paidDate'] as Timestamp).toDate() 
          : null,
      paidBy: data['paidBy'],
      renewCount: data['renewCount'] ?? 0,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    );
  }
  
  // A Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'loanId': loanId,
      'clientId': clientId,
      'walletId': walletId,
      'installmentNumber': installmentNumber,
      'amount': amount,
      'dueDate': Timestamp.fromDate(dueDate),
      'status': _statusToString(status),
      'paidDate': paidDate != null ? Timestamp.fromDate(paidDate!) : null,
      'paidBy': paidBy,
      'renewCount': renewCount,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
  
  // Helpers para conversión
  static InstallmentStatus _statusFromString(String? value) {
    switch (value) {
      case 'pending': return InstallmentStatus.pending;
      case 'paid': return InstallmentStatus.paid;
      case 'overdue': return InstallmentStatus.overdue;
      default: return InstallmentStatus.pending;
    }
  }
  
  static String _statusToString(InstallmentStatus status) {
    switch (status) {
      case InstallmentStatus.pending: return 'pending';
      case InstallmentStatus.paid: return 'paid';
      case InstallmentStatus.overdue: return 'overdue';
    }
  }
  
  // Copiar con cambios
  InstallmentModel copyWith({
    InstallmentStatus? status,
    DateTime? paidDate,
    String? paidBy,
    int? renewCount,
    DateTime? dueDate,
  }) {
    return InstallmentModel(
      id: id,
      loanId: loanId,
      clientId: clientId,
      walletId: walletId,
      installmentNumber: installmentNumber,
      amount: amount,
      dueDate: dueDate ?? this.dueDate,
      status: status ?? this.status,
      paidDate: paidDate ?? this.paidDate,
      paidBy: paidBy ?? this.paidBy,
      renewCount: renewCount ?? this.renewCount,
      createdAt: createdAt,
    );
  }
}

// Enum para colores
enum InstallmentColor {
  green,   // 🟩 Pagada
  red,     // 🟥 Atrasada
  pending, // ⚪ Pendiente
}
