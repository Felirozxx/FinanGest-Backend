import 'package:flutter/material.dart';
import '../../utils/theme.dart';
import 'package:intl/intl.dart';

class LoansScreen extends StatelessWidget {
  const LoansScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: '\$', decimalDigits: 0);
    
    return Column(
      children: [
        // Filtros
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: SegmentedButton<String>(
                  segments: const [
                    ButtonSegment(value: 'all', label: Text('Todos')),
                    ButtonSegment(value: 'active', label: Text('Activos')),
                    ButtonSegment(value: 'overdue', label: Text('Vencidos')),
                  ],
                  selected: {'all'},
                  onSelectionChanged: (Set<String> newSelection) {},
                ),
              ),
            ],
          ),
        ),
        
        // Lista de préstamos
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 8,
            itemBuilder: (context, index) {
              final isOverdue = index % 3 == 0;
              final isPaid = index % 4 == 0;
              
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Column(
                  children: [
                    ListTile(
                      leading: CircleAvatar(
                        backgroundColor: isPaid
                            ? AppTheme.purpleStatus.withOpacity(0.1)
                            : isOverdue
                                ? AppTheme.redStatus.withOpacity(0.1)
                                : AppTheme.greenStatus.withOpacity(0.1),
                        child: Icon(
                          isPaid
                              ? Icons.check_circle
                              : isOverdue
                                  ? Icons.warning
                                  : Icons.account_balance,
                          color: isPaid
                              ? AppTheme.purpleStatus
                              : isOverdue
                                  ? AppTheme.redStatus
                                  : AppTheme.greenStatus,
                        ),
                      ),
                      title: Text('Cliente ${index + 1}'),
                      subtitle: Text('Préstamo #${1000 + index}'),
                      trailing: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            currencyFormat.format(50000),
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            isPaid ? 'Saldado' : isOverdue ? 'Vencido' : 'Activo',
                            style: TextStyle(
                              fontSize: 12,
                              color: isPaid
                                  ? AppTheme.purpleStatus
                                  : isOverdue
                                      ? AppTheme.redStatus
                                      : AppTheme.greenStatus,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Barra de progreso
                    if (!isPaid)
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                        child: Column(
                          children: [
                            LinearProgressIndicator(
                              value: 0.6,
                              backgroundColor: Colors.grey[200],
                              valueColor: AlwaysStoppedAnimation<Color>(
                                isOverdue ? AppTheme.redStatus : AppTheme.greenStatus,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Pagado: ${currencyFormat.format(30000)}',
                                  style: const TextStyle(fontSize: 12),
                                ),
                                Text(
                                  'Resta: ${currencyFormat.format(20000)}',
                                  style: const TextStyle(fontSize: 12),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
