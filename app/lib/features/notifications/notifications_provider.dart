import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/websocket/websocket_service.dart';
import 'notification_rule.dart';
import 'notification_service.dart';

const _rulesKey = 'notification_rules';

/// State for notifications feature
class NotificationsState {
  final List<NotificationRule> rules;
  final bool permissionGranted;
  final bool isLoading;

  const NotificationsState({
    this.rules = const [],
    this.permissionGranted = false,
    this.isLoading = true,
  });

  NotificationsState copyWith({
    List<NotificationRule>? rules,
    bool? permissionGranted,
    bool? isLoading,
  }) {
    return NotificationsState(
      rules: rules ?? this.rules,
      permissionGranted: permissionGranted ?? this.permissionGranted,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  /// Get all enabled rules
  List<NotificationRule> get enabledRules =>
    rules.where((r) => r.enabled).toList();

  /// Check if any rule matches an event
  NotificationRule? findMatchingRule({
    required NotificationSource source,
    String? project,
    String? status,
  }) {
    for (final rule in enabledRules) {
      if (rule.matches(eventSource: source, project: project, status: status)) {
        return rule;
      }
    }
    return null;
  }
}

/// Provider for notifications state
class NotificationsNotifier extends StateNotifier<NotificationsState> {
  NotificationsNotifier() : super(const NotificationsState()) {
    _init();
  }

  final NotificationService _service = NotificationService();

  Future<void> _init() async {
    await _service.initialize(onTap: _onNotificationTap);
    await _loadRules();
    final hasPermission = await _service.hasPermission();
    state = state.copyWith(
      permissionGranted: hasPermission,
      isLoading: false,
    );
  }

  /// Hook into WebSocket service for notification triggers
  void setupWebSocketHook(WebSocketService wsService) {
    wsService.onNotificationMessage = _handleWebSocketMessage;
  }

  void _handleWebSocketMessage(ServerMessage message) {
    checkAndNotify(
      source: message.notificationSource,
      title: message.project ?? 'ORCHON',
      body: message.message ?? message.text ?? message.type,
      project: message.project,
      status: message.status,
      deploymentId: message.deploymentId,
    );
  }

  void _onNotificationTap(NotificationPayload payload) {
    // This will be handled by the main app's navigation
    // The payload is available for routing decisions
    _notificationTapCallback?.call(payload);
  }

  // Callback for navigation (set by main app)
  static NotificationTapCallback? _notificationTapCallback;
  static void setNotificationTapCallback(NotificationTapCallback callback) {
    _notificationTapCallback = callback;
  }

  Future<void> _loadRules() async {
    final prefs = await SharedPreferences.getInstance();
    final json = prefs.getString(_rulesKey);
    if (json != null) {
      try {
        final rules = NotificationRulesCodec.decode(json);
        state = state.copyWith(rules: rules);
      } catch (e) {
        // Invalid JSON, start fresh
        state = state.copyWith(rules: []);
      }
    }
  }

  Future<void> _saveRules() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_rulesKey, NotificationRulesCodec.encode(state.rules));
  }

  /// Request notification permission
  Future<bool> requestPermission() async {
    final granted = await _service.requestPermission();
    state = state.copyWith(permissionGranted: granted);
    return granted;
  }

  /// Add a new rule
  Future<void> addRule(NotificationRule rule) async {
    state = state.copyWith(rules: [...state.rules, rule]);
    await _saveRules();
  }

  /// Update an existing rule
  Future<void> updateRule(NotificationRule rule) async {
    final rules = state.rules.map((r) => r.id == rule.id ? rule : r).toList();
    state = state.copyWith(rules: rules);
    await _saveRules();
  }

  /// Delete a rule
  Future<void> deleteRule(String id) async {
    final rules = state.rules.where((r) => r.id != id).toList();
    state = state.copyWith(rules: rules);
    await _saveRules();
  }

  /// Toggle a rule's enabled state
  Future<void> toggleRule(String id) async {
    final rules = state.rules.map((r) {
      if (r.id == id) {
        return r.copyWith(enabled: !r.enabled);
      }
      return r;
    }).toList();
    state = state.copyWith(rules: rules);
    await _saveRules();
  }

  /// Send a test notification
  Future<void> sendTestNotification() async {
    if (!state.permissionGranted) {
      await requestPermission();
    }
    await _service.showTestNotification();
  }

  /// Check if an event should trigger a notification, and show it if so
  Future<void> checkAndNotify({
    required NotificationSource source,
    required String title,
    required String body,
    String? project,
    String? status,
    String? deploymentId,
  }) async {
    final rule = state.findMatchingRule(
      source: source,
      project: project,
      status: status,
    );

    if (rule != null && state.permissionGranted) {
      await _service.showDeploymentNotification(
        project: project ?? 'ORCHON',
        status: status ?? 'info',
        message: body,
        action: rule.action,
        deploymentId: deploymentId,
      );
    }
  }
}

/// Provider instance
final notificationsProvider =
    StateNotifierProvider<NotificationsNotifier, NotificationsState>((ref) {
  return NotificationsNotifier();
});
