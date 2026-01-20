import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/stats_provider.dart';
import '../../utils/theme.dart';
import 'package:intl/intl.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final currencyFormat = NumberFormat.currency(symbol: '\$', decimalDigits: 0);

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    final statsProvider = Provider.of<StatsProvider>(context, listen: false);
    await statsProvider.loadDailyStats();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _loadStats,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Fecha y hora del servidor
            _buildServerTimeCard(),
            const SizedBox(height: 16),
            
            // Estado del sistema
            _buildSystemStatusCard(),
            const SizedBox(height: 24),
            
            // Estadísticas principales
            const Text(
              'Resumen de Hoy',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            _buildStatsGrid(),
            const SizedBox(height: 24),
            
            // Cobranzas
            const Text(
              'Cobranzas',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            _buildCollectionsCard(),
            const SizedBox(height: 24),
            
            // Préstamos atrasados
            const Text(
              'Atención Requerida',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            _buildOverdueCard(),
            const SizedBox(height: 24),
            
            // Mejores clientes
            const Text(
              'Mejores Clientes',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            _buildTopClientsCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildServerTimeCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            const Icon(Icons.access_time, color: AppTheme.primaryColor),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Hora del Servidor',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                ),
                Text(
                  DateFormat('HH:mm:ss - dd/MM/yyyy').format(DateTime.now()),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSystemStatusCard() {
    final isOpen = DateTime.now().hour >= 6 && DateTime.now().hour < 24;
    
    return Card(
      color: isOpen ? AppTheme.greenStatus.withOpacity(0.1) : AppTheme.redStatus.withOpacity(0.1),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(
              isOpen ? Icons.check_circle : Icons.cancel,
              color: isOpen ? AppTheme.greenStatus : AppTheme.redStatus,
              size: 32,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isOpen ? 'Sistema Abierto' : 'Sistema Cerrado',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isOpen ? AppTheme.greenStatus : AppTheme.redStatus,
                    ),
                  ),
                  Text(
                    isOpen
                        ? 'Operaciones disponibles hasta las 00:00'
                        : 'Sistema abre a las 06:00',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 1.5,
      children: [
        _buildStatCard(
          'Clientes Activos',
          '156',
          Icons.people,
          AppTheme.primaryColor,
        ),
        _buildStatCard(
          'Préstamos Activos',
          '89',
          Icons.account_balance,
          AppTheme.greenStatus,
        ),
        _buildStatCard(
          'Cuotas Vencidas',
          '12',
          Icons.warning,
          AppTheme.redStatus,
        ),
        _buildStatCard(
          'Cobrado Hoy',
          currencyFormat.format(45000),
          Icons.attach_money,
          AppTheme.purpleStatus,
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
              ],
            ),
            Text(
              value,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCollectionsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildCollectionRow('Hoy', 45000, 12),
            const Divider(),
            _buildCollectionRow('Esta Semana', 280000, 67),
            const Divider(),
            _buildCollectionRow('Este Mes', 1250000, 234),
          ],
        ),
      ),
    );
  }

  Widget _buildCollectionRow(String period, int amount, int count) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                period,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppTheme.textSecondary,
                ),
              ),
              Text(
                '$count pagos',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
          ),
          Text(
            currencyFormat.format(amount),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.greenStatus,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOverdueCard() {
    return Card(
      child: Column(
        children: [
          ListTile(
            leading: const CircleAvatar(
              backgroundColor: Color(0xFFFEE2E2),
              child: Icon(Icons.warning, color: AppTheme.redStatus),
            ),
            title: const Text('Juan Pérez'),
            subtitle: const Text('Cuota #3 - 5 días de atraso'),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  currencyFormat.format(5000),
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.redStatus,
                  ),
                ),
                const Text(
                  'Vencida',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppTheme.redStatus,
                  ),
                ),
              ],
            ),
            onTap: () {
              // TODO: Ver detalle del cliente
            },
          ),
          const Divider(height: 1),
          ListTile(
            leading: const CircleAvatar(
              backgroundColor: Color(0xFFFEE2E2),
              child: Icon(Icons.warning, color: AppTheme.redStatus),
            ),
            title: const Text('María González'),
            subtitle: const Text('Cuota #2 - 2 días de atraso'),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  currencyFormat.format(3500),
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.redStatus,
                  ),
                ),
                const Text(
                  'Vencida',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppTheme.redStatus,
                  ),
                ),
              ],
            ),
            onTap: () {
              // TODO: Ver detalle del cliente
            },
          ),
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextButton(
              onPressed: () {
                // TODO: Ver todos los atrasados
              },
              child: const Text('Ver todos los atrasados'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopClientsCard() {
    return Card(
      child: Column(
        children: [
          _buildTopClientTile('Carlos Rodríguez', 15, 98, 1),
          const Divider(height: 1),
          _buildTopClientTile('Ana Martínez', 12, 95, 2),
          const Divider(height: 1),
          _buildTopClientTile('Luis Fernández', 10, 92, 3),
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextButton(
              onPressed: () {
                // TODO: Ver ranking completo
              },
              child: const Text('Ver ranking completo'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopClientTile(String name, int loans, int score, int rank) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: rank == 1
            ? const Color(0xFFFFD700)
            : rank == 2
                ? const Color(0xFFC0C0C0)
                : const Color(0xFFCD7F32),
        child: Text(
          '#$rank',
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      title: Text(name),
      subtitle: Text('$loans préstamos pagados'),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.star, color: Color(0xFFFFD700), size: 20),
          const SizedBox(width: 4),
          Text(
            '$score%',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}
