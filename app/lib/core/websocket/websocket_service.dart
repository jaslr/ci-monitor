import 'dart:async';
import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../../features/notifications/notification_rule.dart';

/// WebSocket connection states
enum WsConnectionState { disconnected, connecting, connected, authenticated, error }

/// Message types from server
class ServerMessage {
  final String type;
  final Map<String, dynamic> data;

  ServerMessage({required this.type, required this.data});

  factory ServerMessage.fromJson(Map<String, dynamic> json) {
    return ServerMessage(
      type: json['type'] as String,
      data: json,
    );
  }

  String? get threadId => data['threadId'] as String?;
  String? get text => data['text'] as String?;
  String? get step => data['step'] as String?;
  String? get actionId => data['actionId'] as String?;
  String? get error => data['error'] as String?;
  String? get prompt => data['prompt'] as String?;
  dynamic get result => data['result'];

  // Notification-related fields
  String? get project => data['project'] as String?;
  String? get status => data['status'] as String?;
  String? get message => data['message'] as String?;
  String? get deploymentId => data['deploymentId'] as String?;

  /// Whether this message should trigger a notification check
  bool get isNotificationWorthy {
    return type == 'deployment.update' ||
           type == 'deployment.failed' ||
           type == 'deployment.success' ||
           type == 'service.status' ||
           type == 'thread.completed' ||
           type == 'thread.error';
  }

  /// Get notification source type
  NotificationSource get notificationSource {
    if (type.startsWith('deployment.')) {
      return NotificationSource.deployment;
    }
    return NotificationSource.websocket;
  }
}

/// Callback for notification-worthy messages
typedef NotificationCallback = void Function(ServerMessage message);

/// WebSocket service for real-time communication with droplet
class WebSocketService {
  WebSocketChannel? _channel;
  final _messageController = StreamController<ServerMessage>.broadcast();
  final _connectionStateController =
      StreamController<WsConnectionState>.broadcast();

  WsConnectionState _state = WsConnectionState.disconnected;
  String? _serverUrl;
  Timer? _reconnectTimer;
  int _reconnectAttempts = 0;
  static const int _maxReconnectAttempts = 5;
  static const Duration _reconnectDelay = Duration(seconds: 3);

  /// Optional callback for notification-worthy messages
  NotificationCallback? onNotificationMessage;

  Stream<ServerMessage> get messages => _messageController.stream;
  Stream<WsConnectionState> get connectionState =>
      _connectionStateController.stream;
  WsConnectionState get currentState => _state;

  /// Connect to the WebSocket server
  Future<void> connect(String serverUrl, {String? authToken}) async {
    print('[WS] connect() called with: $serverUrl');

    if (_state == WsConnectionState.connecting ||
        _state == WsConnectionState.connected) {
      print('[WS] Already connecting/connected, skipping');
      return;
    }

    _serverUrl = serverUrl;
    _updateState(WsConnectionState.connecting);
    print('[WS] Attempting connection...');

    try {
      _channel = WebSocketChannel.connect(Uri.parse(serverUrl));

      // Wait for connection
      print('[WS] Waiting for channel ready...');
      await _channel!.ready;

      print('[WS] Connected successfully!');
      _updateState(WsConnectionState.connected);
      _reconnectAttempts = 0;

      // Send auth if token provided
      if (authToken != null) {
        print('[WS] Sending auth token...');
        send({'type': 'auth', 'token': authToken});
      }

      // Listen for messages
      _channel!.stream.listen(
        _handleMessage,
        onError: _handleError,
        onDone: _handleDisconnect,
      );
    } catch (e) {
      print('[WS] Connection error: $e');
      _updateState(WsConnectionState.error);
      _scheduleReconnect();
    }
  }

  /// Send a message to the server
  void send(Map<String, dynamic> message) {
    if (_state != WsConnectionState.connected || _channel == null) {
      return;
    }
    _channel!.sink.add(jsonEncode(message));
  }

  /// Create a new thread
  void createThread({String? projectHint}) {
    send({
      'type': 'thread.create',
      if (projectHint != null) 'projectHint': projectHint,
    });
  }

  /// Send a message to a thread
  void sendMessage(String threadId, String content, {String? llm}) {
    send({
      'type': 'thread.message',
      'threadId': threadId,
      'content': content,
      if (llm != null) 'llm': llm,
    });
  }

  /// Close a thread
  void closeThread(String threadId) {
    send({
      'type': 'thread.close',
      'threadId': threadId,
    });
  }

  /// Confirm an action
  void confirmAction(String actionId, bool confirmed) {
    send({
      'type': 'action.confirm',
      'actionId': actionId,
      'confirmed': confirmed,
    });
  }

  /// Cancel an action
  void cancelAction(String actionId) {
    send({
      'type': 'action.cancel',
      'actionId': actionId,
    });
  }

  /// Disconnect from server
  void disconnect() {
    _reconnectTimer?.cancel();
    _channel?.sink.close();
    _channel = null;
    _updateState(WsConnectionState.disconnected);
  }

  void _handleMessage(dynamic data) {
    try {
      print('[WS] Received: $data');
      final json = jsonDecode(data as String) as Map<String, dynamic>;
      final message = ServerMessage.fromJson(json);

      // Handle auth success specially to update state
      if (message.type == 'auth.success') {
        print('[WS] Authenticated successfully');
        _updateState(WsConnectionState.authenticated);
      }

      // Check if this message should trigger a notification
      if (message.isNotificationWorthy && onNotificationMessage != null) {
        onNotificationMessage!(message);
      }

      _messageController.add(message);
    } catch (e) {
      print('[WS] Error parsing message: $e');
    }
  }

  void _handleError(Object error) {
    _updateState(WsConnectionState.error);
    _scheduleReconnect();
  }

  void _handleDisconnect() {
    if (_state != WsConnectionState.disconnected) {
      _updateState(WsConnectionState.disconnected);
      _scheduleReconnect();
    }
  }

  void _scheduleReconnect() {
    if (_reconnectAttempts >= _maxReconnectAttempts || _serverUrl == null) {
      return;
    }

    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(_reconnectDelay, () {
      _reconnectAttempts++;
      connect(_serverUrl!);
    });
  }

  void _updateState(WsConnectionState state) {
    _state = state;
    _connectionStateController.add(state);
  }

  void dispose() {
    disconnect();
    _messageController.close();
    _connectionStateController.close();
  }
}

/// Provider for WebSocket service
final webSocketServiceProvider = Provider<WebSocketService>((ref) {
  final service = WebSocketService();
  ref.onDispose(service.dispose);
  return service;
});

/// Provider for connection state
final connectionStateProvider = StreamProvider<WsConnectionState>((ref) {
  final service = ref.watch(webSocketServiceProvider);
  return service.connectionState;
});

/// Provider for incoming messages
final messagesProvider = StreamProvider<ServerMessage>((ref) {
  final service = ref.watch(webSocketServiceProvider);
  return service.messages;
});
