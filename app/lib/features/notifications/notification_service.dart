import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'notification_rule.dart';

/// Payload structure for notification actions
class NotificationPayload {
  final NotificationAction action;
  final String? project;
  final String? deploymentId;

  const NotificationPayload({
    required this.action,
    this.project,
    this.deploymentId,
  });

  Map<String, dynamic> toJson() => {
    'action': action.name,
    'project': project,
    'deploymentId': deploymentId,
  };

  factory NotificationPayload.fromJson(Map<String, dynamic> json) {
    return NotificationPayload(
      action: NotificationAction.values.firstWhere(
        (e) => e.name == json['action'],
        orElse: () => NotificationAction.openClaude,
      ),
      project: json['project'] as String?,
      deploymentId: json['deploymentId'] as String?,
    );
  }

  String encode() => jsonEncode(toJson());
  static NotificationPayload decode(String payload) =>
    NotificationPayload.fromJson(jsonDecode(payload));
}

/// Callback type for handling notification taps
typedef NotificationTapCallback = void Function(NotificationPayload payload);

/// Service for showing local notifications
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _plugin = FlutterLocalNotificationsPlugin();
  NotificationTapCallback? _onNotificationTap;
  bool _initialized = false;

  static const String _channelId = 'orchon_alerts';
  static const String _channelName = 'ORCHON Alerts';
  static const String _channelDescription = 'Deployment and infrastructure notifications';

  /// Initialize the notification service
  Future<void> initialize({NotificationTapCallback? onTap}) async {
    if (_initialized) {
      _onNotificationTap = onTap;
      return;
    }

    _onNotificationTap = onTap;

    // Android settings
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');

    // iOS settings (for future)
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _plugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationResponse,
    );

    // Create notification channel on Android
    if (Platform.isAndroid) {
      await _createAndroidChannel();
    }

    _initialized = true;
  }

  Future<void> _createAndroidChannel() async {
    const channel = AndroidNotificationChannel(
      _channelId,
      _channelName,
      description: _channelDescription,
      importance: Importance.high,
    );

    await _plugin
      .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
      ?.createNotificationChannel(channel);
  }

  void _onNotificationResponse(NotificationResponse response) {
    if (response.payload != null && _onNotificationTap != null) {
      try {
        final payload = NotificationPayload.decode(response.payload!);
        _onNotificationTap!(payload);
      } catch (e) {
        debugPrint('Failed to parse notification payload: $e');
      }
    }
  }

  /// Request notification permission
  Future<bool> requestPermission() async {
    if (Platform.isAndroid) {
      final android = _plugin.resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>();
      return await android?.requestNotificationsPermission() ?? false;
    }
    return true;
  }

  /// Check if notifications are permitted
  Future<bool> hasPermission() async {
    if (Platform.isAndroid) {
      final android = _plugin.resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>();
      return await android?.areNotificationsEnabled() ?? false;
    }
    return true;
  }

  /// Show a notification
  Future<void> show({
    required String title,
    required String body,
    NotificationPayload? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      _channelId,
      _channelName,
      channelDescription: _channelDescription,
      importance: Importance.high,
      priority: Priority.high,
      color: Color(0xFF6366F1), // ORCHON brand color
      colorized: true,
    );

    const details = NotificationDetails(android: androidDetails);

    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000,
      title,
      body,
      details,
      payload: payload?.encode(),
    );
  }

  /// Show a test notification
  Future<void> showTestNotification() async {
    await show(
      title: 'ORCHON Test',
      body: 'Notifications are working! Tap to launch Claude.',
      payload: NotificationPayload(
        action: NotificationAction.openClaude,
        project: null,
      ),
    );
  }

  /// Show a deployment notification
  Future<void> showDeploymentNotification({
    required String project,
    required String status,
    required String message,
    required NotificationAction action,
    String? deploymentId,
  }) async {
    final emoji = _statusEmoji(status);
    await show(
      title: '$emoji $project',
      body: message,
      payload: NotificationPayload(
        action: action,
        project: project,
        deploymentId: deploymentId,
      ),
    );
  }

  String _statusEmoji(String status) {
    switch (status.toLowerCase()) {
      case 'success':
      case 'deployed':
        return '[OK]';
      case 'failed':
      case 'error':
        return '[FAIL]';
      case 'building':
      case 'pending':
        return '[...]';
      default:
        return '[!]';
    }
  }

  /// Cancel all notifications
  Future<void> cancelAll() async {
    await _plugin.cancelAll();
  }
}
