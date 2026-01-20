import 'package:cloud_firestore/cloud_firestore.dart';

enum LoanFrequency { weekly, biweekly, monthly }
enum LoanStatus { active, settled, cancelled }

class LoanModel {
  final String id;
  final String clientId;
  final String walletId;
  final double totalAmount; // Monto total prestado
  final int numberOfInstallments; // Número de cuotas
  final LoanFrequency frequency;
  final DateTime firstDueDate; // Primer vencimiento
  final LoanStatus status;
  final DateTime createdAt;
  final String createdBy; // workerId
  final double paidAmount; // Monto pagado hasta ahora
  final double remainingAmount; // Monto restante
  
  LoanModel({
    required this.id,
    required this.clientId,
    required this.walletId,
    required this.totalAmount,
    required this.numberOfInstallments,
    required this.frequency,
    required this.firstDueDate,
    this.status = LoanStatus.active,
    required this.createdAt,
    required this.createdBy,
    this.paidAmount = 0,
    double? remainingAmount,
  }) : remainingAmount = remainingAmount ?? totalAmount;
  
  // Monto por cuota
  double get installmentAmount => totalAmount / numberOfInstallments;
  
  // Progreso del préstamo (0-100%)
  double get progress => (paidAmount / totalAmount) * 100;
  
  // Verificar si está completamente pagado
  bool get isFullyPaid => remainingAmount <= 0;
  
  // Desde Firestore
  factory LoanModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return LoanModel(
      id: doc.id,
      clientId: data['clientId'] ?? '',
      walletId: data['walletId'] ?? '',
      totalAmount: (data['totalAmount'] ?? 0).toDouble(),
      numberOfInstallments: data['numberOfInstallments'] ?? 0,
      frequency: _frequencyFromString(data['frequency']),
      firstDueDate: (data['firstDueDate'] as Timestamp).toDate(),
      status: _statusFromString(data['status']),
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      createdBy: data['createdBy'] ?? '',
      paidAmount: (data['paidAmount'] ?? 0).toDouble(),
      remainingAmount: (data['remainingAmount'] ?? 0).toDouble(),
    );
  }
  
  // A Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'clientId': clientId,
      'walletId': walletId,
      'totalAmount': totalAmount,
      'numberOfInstallments': numberOfInstallments,
      'frequency': _frequencyToString(frequency),
      'firstDueDate': Timestamp.fromDate(firstDueDate),
      'status': _statusToString(status),
      'createdAt': Timestamp.fromDate(createdAt),
      'createdBy': createdBy,
      'paidAmount': paidAmount,
      'remainingAmount': remainingAmount,
    };
  }
  
  // Helpers para conversión
  static LoanFrequency _frequencyFromString(String? value) {
    switch (value) {
      case 'weekly': return LoanFrequency.weekly;
      case 'biweekly': return LoanFrequency.biweekly;
      case 'monthly': return LoanFrequency.monthly;
      default: return LoanFrequency.weekly;
    }
  }
  
  static String _frequencyToString(LoanFrequency frequency) {
    switch (frequency) {
      case LoanFrequency.weekly: return 'weekly';
      case LoanFrequency.biweekly: return 'biweekly';
      case LoanFrequency.monthly: return 'monthly';
    }
  }
  
  static LoanStatus _statusFromString(String? value) {
    switch (value) {
      case 'active': return LoanStatus.active;
      case 'settled': return LoanStatus.settled;
      case 'cancelled': return LoanStatus.cancelled;
      default: return LoanStatus.active;
    }
  }
  
  static String _statusToString(LoanStatus status) {
    switch (status) {
      case LoanStatus.active: return 'active';
      case LoanStatus.settled: return 'settled';
      case LoanStatus.cancelled: return 'cancelled';
    }
  }
  
  // Copiar con cambios
  LoanModel copyWith({
    LoanStatus? status,
    double? paidAmount,
    double? remainingAmount,
  }) {
    return LoanModel(
      id: id,
      clientId: clientId,
      walletId: walletId,
      totalAmount: totalAmount,
      numberOfInstallments: numberOfInstallments,
      frequency: frequency,
      firstDueDate: firstDueDate,
      status: status ?? this.status,
      createdAt: createdAt,
      createdBy: createdBy,
      paidAmount: paidAmount ?? this.paidAmount,
      remainingAmount: remainingAmount ?? this.remainingAmount,
    );
  }
}
