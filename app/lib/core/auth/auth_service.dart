import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config.dart';

class AuthUser {
  final String email;
  final String? name;

  const AuthUser({required this.email, this.name});

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      email: json['email'] as String,
      name: json['name'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'email': email,
    'name': name,
  };
}

enum AuthStatus {
  unknown,    // Initial state, checking stored auth
  checking,   // Verifying email with backend
  authenticated,
  unauthenticated,
  error,
}

class AuthState {
  final AuthStatus status;
  final AuthUser? user;
  final String? errorMessage;

  const AuthState({
    this.status = AuthStatus.unknown,
    this.user,
    this.errorMessage,
  });

  bool get isAuthenticated => status == AuthStatus.authenticated;

  AuthState copyWith({
    AuthStatus? status,
    AuthUser? user,
    String? errorMessage,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      errorMessage: errorMessage,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  static const _emailKey = 'auth_email';
  static const _passwordKey = 'auth_password';
  static const _userNameKey = 'auth_user_name';

  AuthNotifier() : super(const AuthState()) {
    _loadStoredAuth();
  }

  /// Load stored auth on startup
  Future<void> _loadStoredAuth() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final email = prefs.getString(_emailKey);
      final password = prefs.getString(_passwordKey);

      if (email != null && email.isNotEmpty && password != null && password.isNotEmpty) {
        // Re-verify with backend on each startup
        await signIn(email, password, silent: true);
      } else {
        state = state.copyWith(status: AuthStatus.unauthenticated);
      }
    } catch (e) {
      debugPrint('[AuthService] Error loading stored auth: $e');
      state = state.copyWith(status: AuthStatus.unauthenticated);
    }
  }

  /// Sign in with email and password - verifies against backend database
  /// Retries up to 3 times to handle Fly.io cold starts
  Future<bool> signIn(String email, String password, {bool silent = false}) async {
    if (!silent) {
      state = state.copyWith(status: AuthStatus.checking);
    }

    try {
      final normalizedEmail = email.toLowerCase().trim();

      // Retry logic for Fly.io cold starts
      http.Response? response;
      const maxRetries = 3;
      for (var attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          response = await http.post(
            Uri.parse('${AppConfig.orchonUrl}/auth/verify'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'email': normalizedEmail, 'password': password}),
          ).timeout(const Duration(seconds: 15));

          // If we get a valid response (not a cold start error), break
          if (response.statusCode != 503 &&
              !response.body.contains('Database unavailable')) {
            break;
          }

          // Wait before retry (backend is waking up)
          if (attempt < maxRetries) {
            debugPrint('[AuthService] Backend cold start, retry $attempt/$maxRetries...');
            await Future.delayed(Duration(seconds: attempt * 2));
          }
        } catch (e) {
          if (attempt == maxRetries) rethrow;
          debugPrint('[AuthService] Request failed, retry $attempt/$maxRetries...');
          await Future.delayed(Duration(seconds: attempt * 2));
        }
      }

      if (response == null) {
        throw Exception('Failed to connect after $maxRetries attempts');
      }

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data['authorized'] == true) {
          final user = AuthUser.fromJson(data['user']);

          // Store credentials
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString(_emailKey, user.email);
          await prefs.setString(_passwordKey, password);
          if (user.name != null) {
            await prefs.setString(_userNameKey, user.name!);
          }

          state = AuthState(
            status: AuthStatus.authenticated,
            user: user,
          );

          debugPrint('[AuthService] Authenticated as ${user.email}');
          return true;
        }
      }

      // Not authorised
      state = AuthState(
        status: AuthStatus.unauthenticated,
        errorMessage: 'Invalid credentials',
      );
      return false;
    } catch (e) {
      debugPrint('[AuthService] Sign in error: $e');

      // If silent (startup check) and we have stored creds, allow offline access
      if (silent) {
        final prefs = await SharedPreferences.getInstance();
        final storedEmail = prefs.getString(_emailKey);
        final storedPassword = prefs.getString(_passwordKey);
        if (storedEmail != null && storedPassword != null) {
          final storedName = prefs.getString(_userNameKey);
          state = AuthState(
            status: AuthStatus.authenticated,
            user: AuthUser(email: storedEmail, name: storedName),
          );
          debugPrint('[AuthService] Offline mode - using stored credentials');
          return true;
        }
      }

      state = AuthState(
        status: AuthStatus.error,
        errorMessage: 'Connection failed: ${e.toString()}',
      );
      return false;
    }
  }

  /// Sign out - clear stored credentials
  Future<void> signOut() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_emailKey);
    await prefs.remove(_passwordKey);
    await prefs.remove(_userNameKey);

    state = const AuthState(status: AuthStatus.unauthenticated);
    debugPrint('[AuthService] Signed out');
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
