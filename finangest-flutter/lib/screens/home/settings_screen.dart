import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../utils/theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final isAdmin = authProvider.currentUser?.isAdmin ?? false;
    
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Perfil
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 40,
                  backgroundColor: AppTheme.primaryColor,
                  child: Text(
                    authProvider.currentUser?.displayName[0].toUpperCase() ?? 'U',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  authProvider.currentUser?.displayName ?? '',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  authProvider.currentUser?.email ?? '',
                  style: const TextStyle(
                    color: AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(height: 8),
                Chip(
                  label: Text(
                    isAdmin ? 'Administrador' : 'Worker',
                    style: const TextStyle(color: Colors.white),
                  ),
                  backgroundColor: isAdmin ? AppTheme.purpleStatus : AppTheme.primaryColor,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        
        // Configuración general
        const Text(
          'General',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppTheme.textSecondary,
          ),
        ),
        const SizedBox(height: 8),
        Card(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.language),
                title: const Text('Idioma'),
                subtitle: const Text('Español'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.notifications),
                title: const Text('Notificaciones'),
                trailing: Switch(
                  value: true,
                  onChanged: (value) {},
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.dark_mode),
                title: const Text('Tema Oscuro'),
                trailing: Switch(
                  value: false,
                  onChanged: (value) {},
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        
        // Admin only
        if (isAdmin) ...[
          const Text(
            'Administración',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.people),
                  title: const Text('Gestionar Usuarios'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {},
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.account_balance_wallet),
                  title: const Text('Gestionar Carteras'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {},
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.backup),
                  title: const Text('Backups'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {},
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.history),
                  title: const Text('Auditoría'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],
        
        // Legal
        const Text(
          'Legal',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppTheme.textSecondary,
          ),
        ),
        const SizedBox(height: 8),
        Card(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.description),
                title: const Text('Términos de Uso'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.privacy_tip),
                title: const Text('Política de Privacidad'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        
        // Acerca de
        Card(
          child: ListTile(
            leading: const Icon(Icons.info),
            title: const Text('Acerca de FinanGest'),
            subtitle: const Text('Versión 1.0.0'),
            onTap: () {
              showAboutDialog(
                context: context,
                applicationName: 'FinanGest',
                applicationVersion: '1.0.0',
                applicationIcon: const Icon(
                  Icons.account_balance_wallet,
                  size: 48,
                  color: AppTheme.primaryColor,
                ),
                children: [
                  const Text('Sistema profesional de gestión de cobranzas'),
                ],
              );
            },
          ),
        ),
        const SizedBox(height: 32),
        
        // Cerrar sesión
        ElevatedButton.icon(
          onPressed: () async {
            final confirm = await showDialog<bool>(
              context: context,
              builder: (context) => AlertDialog(
                title: const Text('Cerrar Sesión'),
                content: const Text('¿Estás seguro que deseas cerrar sesión?'),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context, false),
                    child: const Text('Cancelar'),
                  ),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context, true),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.redStatus,
                    ),
                    child: const Text('Cerrar Sesión'),
                  ),
                ],
              ),
            );
            
            if (confirm == true && context.mounted) {
              await authProvider.signOut();
              if (context.mounted) {
                Navigator.of(context).pushReplacementNamed('/login');
              }
            }
          },
          icon: const Icon(Icons.logout),
          label: const Text('Cerrar Sesión'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.redStatus,
            minimumSize: const Size(double.infinity, 48),
          ),
        ),
      ],
    );
  }
}
