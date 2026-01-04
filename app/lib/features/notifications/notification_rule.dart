import 'dart:convert';

/// What can trigger a notification
enum NotificationSource {
  deployment,   // ORCHON backend deployment events
  websocket,    // Droplet messages (Claude thread, service status)
  all,          // Any source
}

/// What happens when you tap the notification
enum NotificationAction {
  openClaude,      // Launch Claude with project context (default)
  openDeployment,  // Open deployment detail screen
  openApp,         // Just open home screen
}

/// A user-defined notification rule
class NotificationRule {
  final String id;
  final String name;
  final bool enabled;
  final NotificationSource source;
  final List<String> projects;  // empty = all projects
  final List<String> statuses;  // empty = all statuses
  final NotificationAction action;

  const NotificationRule({
    required this.id,
    required this.name,
    this.enabled = true,
    this.source = NotificationSource.all,
    this.projects = const [],
    this.statuses = const [],
    this.action = NotificationAction.openClaude,
  });

  NotificationRule copyWith({
    String? id,
    String? name,
    bool? enabled,
    NotificationSource? source,
    List<String>? projects,
    List<String>? statuses,
    NotificationAction? action,
  }) {
    return NotificationRule(
      id: id ?? this.id,
      name: name ?? this.name,
      enabled: enabled ?? this.enabled,
      source: source ?? this.source,
      projects: projects ?? this.projects,
      statuses: statuses ?? this.statuses,
      action: action ?? this.action,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'enabled': enabled,
      'source': source.name,
      'projects': projects,
      'statuses': statuses,
      'action': action.name,
    };
  }

  factory NotificationRule.fromJson(Map<String, dynamic> json) {
    return NotificationRule(
      id: json['id'] as String,
      name: json['name'] as String,
      enabled: json['enabled'] as bool? ?? true,
      source: NotificationSource.values.firstWhere(
        (e) => e.name == json['source'],
        orElse: () => NotificationSource.all,
      ),
      projects: List<String>.from(json['projects'] ?? []),
      statuses: List<String>.from(json['statuses'] ?? []),
      action: NotificationAction.values.firstWhere(
        (e) => e.name == json['action'],
        orElse: () => NotificationAction.openClaude,
      ),
    );
  }

  /// Check if this rule matches an event
  bool matches({
    required NotificationSource eventSource,
    String? project,
    String? status,
  }) {
    if (!enabled) return false;

    // Check source
    if (source != NotificationSource.all && source != eventSource) {
      return false;
    }

    // Check project filter
    if (projects.isNotEmpty && project != null) {
      if (!projects.any((p) =>
        project.toLowerCase().contains(p.toLowerCase()) ||
        p.toLowerCase().contains(project.toLowerCase())
      )) {
        return false;
      }
    }

    // Check status filter
    if (statuses.isNotEmpty && status != null) {
      if (!statuses.contains(status.toLowerCase())) {
        return false;
      }
    }

    return true;
  }

  /// Human-readable description of the rule
  String get description {
    final parts = <String>[];

    if (source == NotificationSource.deployment) {
      parts.add('Deployments');
    } else if (source == NotificationSource.websocket) {
      parts.add('WebSocket events');
    } else {
      parts.add('All events');
    }

    if (projects.isNotEmpty) {
      parts.add('for ${projects.join(", ")}');
    }

    if (statuses.isNotEmpty) {
      parts.add('(${statuses.join(", ")})');
    }

    return parts.join(' ');
  }
}

/// Helper to serialize/deserialize list of rules
class NotificationRulesCodec {
  static String encode(List<NotificationRule> rules) {
    return jsonEncode(rules.map((r) => r.toJson()).toList());
  }

  static List<NotificationRule> decode(String json) {
    final List<dynamic> data = jsonDecode(json);
    return data.map((e) => NotificationRule.fromJson(e)).toList();
  }
}
