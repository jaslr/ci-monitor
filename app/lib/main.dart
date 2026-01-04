import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'core/auth/auth_service.dart';
import 'features/auth/login_screen.dart';
import 'features/deployments/deployments_screen.dart';
import 'features/notifications/notification_rule.dart';
import 'features/notifications/notification_service.dart';
import 'features/notifications/notifications_provider.dart';
import 'features/terminal/ssh_terminal_screen.dart';

// Global error log
final List<String> errorLog = [];

// Global navigator key for handling notification taps
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

Future<void> logError(String error) async {
  final timestamp = DateTime.now().toIso8601String();
  final entry = '[$timestamp] $error';
  errorLog.add(entry);

  try {
    final dir = await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/orchon_crash.log');
    await file.writeAsString('$entry\n', mode: FileMode.append);
  } catch (e) {
    // Can't write to file, just keep in memory
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Catch Flutter framework errors
  FlutterError.onError = (details) {
    logError('FlutterError: ${details.exception}\n${details.stack}');
    // Don't crash - just log
  };

  // Initialize notifications
  await NotificationService().initialize(
    onTap: _handleNotificationTap,
  );

  // Set up notification tap callback for provider
  NotificationsNotifier.setNotificationTapCallback(_handleNotificationTap);

  runApp(const ProviderScope(child: OrchonApp()));
}

/// Handle notification tap - navigate based on action type
void _handleNotificationTap(NotificationPayload payload) {
  final context = navigatorKey.currentContext;
  if (context == null) return;

  switch (payload.action) {
    case NotificationAction.openClaude:
      // Launch Claude with project context
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => SshTerminalScreen(
            launchMode: LaunchMode.claude,
            initialCommand: payload.project != null
              ? 'cd /root/projects/${payload.project} && claude'
              : null,
          ),
        ),
      );
      break;

    case NotificationAction.openDeployment:
      // TODO: Navigate to deployment detail when implemented
      // For now, just open app
      break;

    case NotificationAction.openApp:
      // App is already open, nothing to do
      break;
  }
}

class OrchonApp extends ConsumerWidget {
  const OrchonApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return MaterialApp(
      navigatorKey: navigatorKey,
      title: 'ORCHON',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFF0F0F23),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0F0F23),
          elevation: 0,
        ),
      ),
      home: _buildHome(authState),
    );
  }

  Widget _buildHome(AuthState authState) {
    switch (authState.status) {
      case AuthStatus.unknown:
        // Show loading screen while checking stored auth
        return const Scaffold(
          backgroundColor: Color(0xFF0F0F23),
          body: Center(
            child: CircularProgressIndicator(
              color: Color(0xFF6366F1),
            ),
          ),
        );
      case AuthStatus.authenticated:
        return const DeploymentsScreen();
      case AuthStatus.unauthenticated:
      case AuthStatus.checking:
      case AuthStatus.error:
        return const LoginScreen();
    }
  }
}

// Error display app (fallback if main app crashes)
class ErrorApp extends StatelessWidget {
  final String error;
  final List<String> log;

  const ErrorApp({super.key, required this.error, required this.log});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: ErrorScreen(error: error, log: log),
    );
  }
}

class ErrorScreen extends StatelessWidget {
  final String error;
  final List<String> log;

  const ErrorScreen({super.key, required this.error, required this.log});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F23),
      appBar: AppBar(
        title: const Text('ORCHON - Error'),
        backgroundColor: Colors.red[900],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'App crashed with error:',
              style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red[900]?.withOpacity(0.3),
                borderRadius: BorderRadius.circular(8),
              ),
              child: SelectableText(
                error,
                style: const TextStyle(color: Colors.white, fontFamily: 'monospace'),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Error log:',
              style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[900],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: ListView.builder(
                  itemCount: log.length,
                  itemBuilder: (context, index) {
                    return SelectableText(
                      log[index],
                      style: const TextStyle(
                        color: Colors.white70,
                        fontFamily: 'monospace',
                        fontSize: 12,
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
