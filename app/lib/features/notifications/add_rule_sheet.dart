import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'notification_rule.dart';
import 'notifications_provider.dart';

class AddRuleSheet extends ConsumerStatefulWidget {
  final NotificationRule? editRule;

  const AddRuleSheet({super.key, this.editRule});

  @override
  ConsumerState<AddRuleSheet> createState() => _AddRuleSheetState();
}

class _AddRuleSheetState extends ConsumerState<AddRuleSheet> {
  late TextEditingController _nameController;
  late NotificationSource _source;
  late NotificationAction _action;
  late List<String> _selectedProjects;
  late List<String> _selectedStatuses;
  late bool _enabled;

  bool get isEditing => widget.editRule != null;

  // Available options
  static const _projects = ['livna', 'brontiq', 'orchon', 'doewah', 'junipa'];
  static const _statuses = ['success', 'failed', 'building', 'pending', 'error'];

  @override
  void initState() {
    super.initState();
    final rule = widget.editRule;
    _nameController = TextEditingController(text: rule?.name ?? '');
    _source = rule?.source ?? NotificationSource.all;
    _action = rule?.action ?? NotificationAction.openClaude;
    _selectedProjects = List.from(rule?.projects ?? []);
    _selectedStatuses = List.from(rule?.statuses ?? []);
    _enabled = rule?.enabled ?? true;
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final brandColor = const Color(0xFF6366F1);

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Text(
                    isEditing ? 'EDIT RULE' : 'NEW RULE',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                      letterSpacing: 3,
                      color: Colors.grey[400],
                    ),
                  ),
                  const Spacer(),
                  if (isEditing)
                    Switch(
                      value: _enabled,
                      onChanged: (v) => setState(() => _enabled = v),
                      activeColor: brandColor,
                    ),
                ],
              ),
              const SizedBox(height: 16),

              // Name field
              TextField(
                controller: _nameController,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Rule name',
                  labelStyle: TextStyle(color: Colors.grey[500]),
                  hintText: 'e.g., "Failed deploys", "Livna alerts"',
                  hintStyle: TextStyle(color: Colors.grey[700]),
                  filled: true,
                  fillColor: const Color(0xFF0F0F23),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Source selection
              _SectionHeader(title: 'SOURCE'),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: NotificationSource.values.map((source) {
                  final selected = _source == source;
                  return ChoiceChip(
                    label: Text(_sourceLabel(source)),
                    selected: selected,
                    onSelected: (_) => setState(() => _source = source),
                    selectedColor: brandColor,
                    backgroundColor: const Color(0xFF0F0F23),
                    labelStyle: TextStyle(
                      color: selected ? Colors.white : Colors.grey[400],
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),

              // Project filter
              _SectionHeader(
                title: 'PROJECTS',
                subtitle: 'Leave empty for all',
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _projects.map((project) {
                  final selected = _selectedProjects.contains(project);
                  return FilterChip(
                    label: Text(project),
                    selected: selected,
                    onSelected: (v) {
                      setState(() {
                        if (v) {
                          _selectedProjects.add(project);
                        } else {
                          _selectedProjects.remove(project);
                        }
                      });
                    },
                    selectedColor: brandColor.withOpacity(0.3),
                    backgroundColor: const Color(0xFF0F0F23),
                    labelStyle: TextStyle(
                      color: selected ? brandColor : Colors.grey[400],
                    ),
                    checkmarkColor: brandColor,
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),

              // Status filter
              _SectionHeader(
                title: 'STATUSES',
                subtitle: 'Leave empty for all',
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _statuses.map((status) {
                  final selected = _selectedStatuses.contains(status);
                  return FilterChip(
                    label: Text(status),
                    selected: selected,
                    onSelected: (v) {
                      setState(() {
                        if (v) {
                          _selectedStatuses.add(status);
                        } else {
                          _selectedStatuses.remove(status);
                        }
                      });
                    },
                    selectedColor: _statusColor(status).withOpacity(0.3),
                    backgroundColor: const Color(0xFF0F0F23),
                    labelStyle: TextStyle(
                      color: selected ? _statusColor(status) : Colors.grey[400],
                    ),
                    checkmarkColor: _statusColor(status),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),

              // Action selection
              _SectionHeader(title: 'TAP ACTION'),
              const SizedBox(height: 8),
              ...NotificationAction.values.map((action) {
                return RadioListTile<NotificationAction>(
                  value: action,
                  groupValue: _action,
                  onChanged: (v) => setState(() => _action = v!),
                  title: Text(
                    _actionLabel(action),
                    style: const TextStyle(color: Colors.white),
                  ),
                  subtitle: Text(
                    _actionDescription(action),
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                  activeColor: brandColor,
                  contentPadding: EdgeInsets.zero,
                );
              }),
              const SizedBox(height: 24),

              // Save button
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _save,
                  style: FilledButton.styleFrom(
                    backgroundColor: brandColor,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: Text(isEditing ? 'Save Changes' : 'Create Rule'),
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }

  void _save() {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a rule name')),
      );
      return;
    }

    final rule = NotificationRule(
      id: widget.editRule?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
      name: name,
      enabled: _enabled,
      source: _source,
      projects: _selectedProjects,
      statuses: _selectedStatuses,
      action: _action,
    );

    final notifier = ref.read(notificationsProvider.notifier);
    if (isEditing) {
      notifier.updateRule(rule);
    } else {
      notifier.addRule(rule);
    }

    Navigator.pop(context);
  }

  String _sourceLabel(NotificationSource source) {
    switch (source) {
      case NotificationSource.deployment:
        return 'Deployments';
      case NotificationSource.websocket:
        return 'WebSocket';
      case NotificationSource.all:
        return 'All';
    }
  }

  String _actionLabel(NotificationAction action) {
    switch (action) {
      case NotificationAction.openClaude:
        return 'Launch Claude';
      case NotificationAction.openDeployment:
        return 'Open deployment details';
      case NotificationAction.openApp:
        return 'Open app';
    }
  }

  String _actionDescription(NotificationAction action) {
    switch (action) {
      case NotificationAction.openClaude:
        return 'SSH into droplet with project context (recommended)';
      case NotificationAction.openDeployment:
        return 'Navigate to deployment detail screen';
      case NotificationAction.openApp:
        return 'Just open the app to home screen';
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'success':
        return Colors.green;
      case 'failed':
      case 'error':
        return Colors.red;
      case 'building':
      case 'pending':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final String? subtitle;

  const _SectionHeader({required this.title, this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            letterSpacing: 2,
            color: Colors.grey[500],
          ),
        ),
        if (subtitle != null)
          Text(
            subtitle!,
            style: TextStyle(
              fontSize: 11,
              color: Colors.grey[700],
            ),
          ),
      ],
    );
  }
}
