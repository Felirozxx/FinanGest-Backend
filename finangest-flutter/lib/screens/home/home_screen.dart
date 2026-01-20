import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/wallet_provider.dart';
import '../../providers/system_schedule_provider.dart';
import '../../utils/theme.dart';
import 'dashboard_screen.dart';
import 'clients_screen.dart';
import 'loans_screen.dart';
import 'payments_screen.dart';
import 'settings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  
  final List<Widget> _screens = [
    const DashboardScreen(),
    const ClientsScreen(),
    const LoansScreen(),
    const PaymentsScreen(),
    const SettingsScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _checkWalletAccess();
  }

  Future<void> _checkWalletAccess() async {
    final walletProvider = Provider.of<WalletProvider>(context, listen: false);
    
    // Si no hay cartera seleccionada, mostrar selector
    if (walletProvider.currentWallet == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _showWalletSelector();
      });
    }
  }

  void _showWalletSelector() {
    showModalBottomSheet(
      context: context,
      isDismissible: false,
      enableDrag: false,
      builder: (context) => WalletSelectorSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final walletProvider = Provider.of<WalletProvider>(context);
    final systemSchedule = Provider.of<SystemScheduleProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.account_balance_wallet, size: 24),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'FinanGest',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                if (walletProvider.currentWallet != null)
                  Text(
                    walletProvider.currentWallet!.name,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                    ),
                  ),
              ],
            ),
            const Spacer(),
            // Indicador de estado del sistema
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: systemSchedule.isSystemOpen 
                    ? AppTheme.greenStatus.withOpacity(0.2)
                    : AppTheme.redStatus.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    systemSchedule.getSystemStatusEmoji(),
                    style: const TextStyle(fontSize: 12),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    systemSchedule.isSystemOpen ? 'Abierto' : 'Cerrado',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: systemSchedule.isSystemOpen 
                          ? AppTheme.greenStatus
                          : AppTheme.redStatus,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          // Cambiar cartera
          if (walletProvider.currentWallet != null)
            IconButton(
              icon: const Icon(Icons.swap_horiz),
              tooltip: 'Cambiar cartera',
              onPressed: _showWalletSelector,
            ),
          
          // Notificaciones
          IconButton(
            icon: const Badge(
              label: Text('3'),
              child: Icon(Icons.notifications_outlined),
            ),
            onPressed: () {
              // TODO: Mostrar notificaciones
            },
          ),
          
          // Perfil
          PopupMenuButton<String>(
            icon: CircleAvatar(
              backgroundColor: AppTheme.primaryColor,
              child: Text(
                authProvider.currentUser?.displayName?[0].toUpperCase() ?? 'U',
                style: const TextStyle(color: Colors.white),
              ),
            ),
            itemBuilder: (context) => <PopupMenuEntry<String>>[
              PopupMenuItem(
                child: ListTile(
                  leading: const Icon(Icons.person),
                  title: Text(authProvider.currentUser?.displayName ?? ''),
                  subtitle: Text(authProvider.currentUser?.email ?? ''),
                ),
              ),
              const PopupMenuDivider(),
              PopupMenuItem(
                child: const ListTile(
                  leading: Icon(Icons.settings),
                  title: Text('Configuración'),
                ),
                onTap: () {
                  setState(() {
                    _currentIndex = 4;
                  });
                },
              ),
              PopupMenuItem(
                child: const ListTile(
                  leading: Icon(Icons.logout, color: AppTheme.redStatus),
                  title: Text(
                    'Cerrar Sesión',
                    style: TextStyle(color: AppTheme.redStatus),
                  ),
                ),
                onTap: () async {
                  await authProvider.signOut();
                  if (context.mounted) {
                    Navigator.of(context).pushReplacementNamed('/login');
                  }
                },
              ),
            ],
          ),
        ],
      ),
      body: systemSchedule.isSystemOpen 
          ? _screens[_currentIndex]
          : _buildClosedSystemView(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people),
            label: 'Clientes',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance),
            label: 'Préstamos',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.payment),
            label: 'Pagos',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Ajustes',
          ),
        ],
      ),
      floatingActionButton: _currentIndex == 1 || _currentIndex == 2
          ? FloatingActionButton.extended(
              onPressed: () {
                final systemSchedule = Provider.of<SystemScheduleProvider>(context, listen: false);
                
                // Verificar si el sistema está abierto
                if (!systemSchedule.isSystemOpen) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Sistema cerrado. Solo lectura hasta las 6:00 AM'),
                      backgroundColor: AppTheme.redStatus,
                    ),
                  );
                  return;
                }
                
                if (_currentIndex == 1) {
                  // Agregar cliente
                  _showAddClientDialog();
                } else if (_currentIndex == 2) {
                  // Agregar préstamo
                  _showAddLoanDialog();
                }
              },
              icon: const Icon(Icons.add),
              label: Text(_currentIndex == 1 ? 'Cliente' : 'Préstamo'),
            )
          : null,
    );
  }

  Widget _buildClosedSystemView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.nightlight_round,
              size: 80,
              color: AppTheme.primaryColor.withOpacity(0.5),
            ),
            const SizedBox(height: 24),
            const Text(
              'Sistema Cerrado',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'El sistema está cerrado entre las 12:00 AM y las 6:00 AM',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: AppTheme.textSecondary,
              ),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.yellowStatus.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppTheme.yellowStatus.withOpacity(0.3),
                ),
              ),
              child: Column(
                children: [
                  const Icon(
                    Icons.info_outline,
                    color: AppTheme.yellowStatus,
                    size: 32,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Durante este período:',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '• Puedes ver todos los datos\n'
                    '• No puedes crear ni editar\n'
                    '• No puedes registrar pagos\n'
                    '• El sistema se abre automáticamente a las 6:00 AM',
                    textAlign: TextAlign.left,
                    style: TextStyle(color: AppTheme.textSecondary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _currentIndex = 0; // Ir al dashboard para ver datos
                });
              },
              icon: const Icon(Icons.visibility),
              label: const Text('Ver Dashboard'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddClientDialog() {
    // TODO: Implementar diálogo de agregar cliente
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Agregar cliente - En desarrollo')),
    );
  }

  void _showAddLoanDialog() {
    // TODO: Implementar diálogo de agregar préstamo
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Agregar préstamo - En desarrollo')),
    );
  }
}

// Widget para seleccionar cartera
class WalletSelectorSheet extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final walletProvider = Provider.of<WalletProvider>(context);
    
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Selecciona una Cartera',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Ingresa la contraseña de la cartera para acceder',
            style: TextStyle(color: AppTheme.textSecondary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          
          // Lista de carteras disponibles
          Expanded(
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: 3, // TODO: Obtener de walletProvider
              itemBuilder: (context, index) {
                return Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                      child: const Icon(
                        Icons.account_balance_wallet,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                    title: Text('Cartera ${index + 1}'),
                    subtitle: const Text('Toca para desbloquear'),
                    trailing: const Icon(Icons.lock_outline),
                    onTap: () {
                      _showPasswordDialog(context, 'Cartera ${index + 1}');
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _showPasswordDialog(BuildContext context, String walletName) {
    final passwordController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Desbloquear $walletName'),
        content: TextField(
          controller: passwordController,
          obscureText: true,
          decoration: const InputDecoration(
            labelText: 'Contraseña',
            prefixIcon: Icon(Icons.lock),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              // TODO: Verificar contraseña con Cloud Function
              Navigator.pop(context);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Cartera desbloqueada')),
              );
            },
            child: const Text('Desbloquear'),
          ),
        ],
      ),
    );
  }
}
