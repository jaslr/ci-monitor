import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'notification_rule.dart';
import 'notifications_provider.dart';
import 'add_rule_sheet.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(notificationsProvider);
    final notifier = ref.read(notificationsProvider.notifier);

    return Scaffold(
      backgroundColor: const Color(0xFF0F0F23),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1A1A2E),
        title: const Text('Notifications'),
      ),
      body: state.isLoading
          ? const Center(child: CircularProgressIndicator())
          : _buildBody(context, ref, state),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF6366F1),
        onPressed: () => _showAddRuleSheet(context, ref),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildBody(BuildContext context, WidgetRef ref, NotificationsState state) {
    final notifier = ref.read(notificationsProvider.notifier);

    // Permission banner
    final permissionBanner = !state.permissionGranted
        ? _PermissionBanner(ref: ref)
        : null;

    // Test notification button at bottom
    final testButton = _TestNotificationButton(notifier: notifier);

    if (state.rules.isEmpty) {
      return Column(
        children: [
          if (permissionBanner != null) permissionBanner,
          Expanded(child: _buildEmptyState(context)),
          testButton,
        ],
      );
    }

    return Column(
      children: [
        if (permissionBanner != null) permissionBanner,
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.only(bottom: 16),
            itemCount: state.rules.length,
            itemBuilder: (context, index) {
              final rule = state.rules[index];
              return _RuleTile(
                rule: rule,
                onTap: () => _showAddRuleSheet(context, ref, editRule: rule),
                onToggle: () => ref.read(notificationsProvider.notifier).toggleRule(rule.id),
                onDelete: () => _confirmDelete(context, ref, rule),
              );
            },
          ),
        ),
        testButton,
      ],
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.notifications_off_outlined,
              size: 64,
              color: Colors.grey[700],
            ),
            const SizedBox(height: 16),
            Text(
              'No notification rules',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Colors.grey[400],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Tap + to create a rule for deployment alerts, service status, or other events.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddRuleSheet(BuildContext context, WidgetRef ref, {NotificationRule? editRule}) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1A1A2E),
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => AddRuleSheet(editRule: editRule),
    );
  }

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref, NotificationRule rule) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        title: const Text('Delete Rule?'),
        content: Text('Delete "${rule.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await ref.read(notificationsProvider.notifier).deleteRule(rule.id);
    }
  }
}

class _PermissionBanner extends StatelessWidget {
  final WidgetRef ref;

  const _PermissionBanner({required this.ref});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.orange.withOpacity(0.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.orange.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.warning_amber, color: Colors.orange),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Notifications disabled',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  'Enable to receive alerts',
                  style: TextStyle(
                    color: Colors.grey[400],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: () async {
              await ref.read(notificationsProvider.notifier).requestPermission();
            },
            child: const Text('Enable'),
          ),
        ],
      ),
    );
  }
}

class _RuleTile extends StatelessWidget {
  final NotificationRule rule;
  final VoidCallback onTap;
  final VoidCallback onToggle;
  final VoidCallback onDelete;

  const _RuleTile({
    required this.rule,
    required this.onTap,
    required this.onToggle,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final brandColor = const Color(0xFF6366F1);

    return Dismissible(
      key: Key(rule.id),
      direction: DismissDirection.endToStart,
      background: Container(
        color: Colors.red,
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 16),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      confirmDismiss: (_) async {
        onDelete();
        return false; // We handle deletion in confirmDelete dialog
      },
      child: ListTile(
        onTap: onTap,
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: rule.enabled
                ? brandColor.withOpacity(0.2)
                : Colors.grey[850],
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            _sourceIcon(rule.source),
            color: rule.enabled ? brandColor : Colors.grey[600],
            size: 20,
          ),
        ),
        title: Text(
          rule.name,
          style: TextStyle(
            color: rule.enabled ? Colors.white : Colors.grey[500],
            fontWeight: FontWeight.w500,
          ),
        ),
        subtitle: Text(
          rule.description,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
          ),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Action badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.grey[850],
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                _actionLabel(rule.action),
                style: TextStyle(
                  color: Colors.grey[500],
                  fontSize: 10,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Switch(
              value: rule.enabled,
              onChanged: (_) => onToggle(),
              activeColor: brandColor,
            ),
          ],
        ),
      ),
    );
  }

  IconData _sourceIcon(NotificationSource source) {
    switch (source) {
      case NotificationSource.deployment:
        return Icons.rocket_launch;
      case NotificationSource.websocket:
        return Icons.wifi;
      case NotificationSource.all:
        return Icons.notifications;
    }
  }

  String _actionLabel(NotificationAction action) {
    switch (action) {
      case NotificationAction.openClaude:
        return 'Claude';
      case NotificationAction.openDeployment:
        return 'Details';
      case NotificationAction.openApp:
        return 'App';
    }
  }
}

class _TestNotificationButton extends StatelessWidget {
  final NotificationsNotifier notifier;

  const _TestNotificationButton({required this.notifier});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () async {
              await notifier.sendTestNotification();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Test notification sent'),
                    duration: Duration(seconds: 2),
                  ),
                );
              }
            },
            icon: const Icon(Icons.notifications_active),
            label: const Text('Send Test Notification'),
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.grey[400],
              side: BorderSide(color: Colors.grey[700]!),
              padding: const EdgeInsets.symmetric(vertical: 12),
            ),
          ),
        ),
      ),
    );
  }
}
