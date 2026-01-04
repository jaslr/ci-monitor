# Push Notifications Design

## Overview

Local push notifications for ORCHON app with configurable rules. Off by default, user creates rules to enable specific notification types.

## Data Model

```dart
enum NotificationSource { deployment, websocket, all }
enum NotificationAction { openClaude, openDeployment, openApp }

class NotificationRule {
  String id;
  String name;
  bool enabled;
  NotificationSource source;
  List<String> projects;    // empty = all
  List<String> statuses;    // empty = all
  NotificationAction action; // default: openClaude
}
```

## UI Components

### 1. Notifications Settings Screen
- List of user-created rules (empty by default)
- "Test Notification" button at top
- FAB to add new rule
- Swipe to delete, tap to edit

### 2. Add/Edit Rule Sheet
- Name field
- Source picker (Deployment / WebSocket / All)
- Project multi-select (from ORCHON owners)
- Status multi-select (success, failed, building, etc.)
- Action picker (default: Launch Claude)
- Enable/disable toggle

### 3. Test Notification
- Shows sample notification with ORCHON branding
- Tapping it demonstrates the action flow

## Storage

SharedPreferences with JSON serialization:
- `notification_rules` - List<NotificationRule> as JSON
- `notifications_initialized` - bool for permission request

## Notification Triggers

### WebSocket Integration
In `websocket_service.dart`, when message received:
1. Parse message type (deployment, thread, service)
2. Check against all enabled rules
3. If match, show local notification

### ORCHON API Integration
In `orchon_service.dart`, when fetching deployments:
1. Compare with last known state
2. If status changed and matches a rule, notify

## Notification Display

- **Title**: Project name or "ORCHON"
- **Body**: Event description ("Livna deploy failed")
- **Icon**: ORCHON logo (need to add as drawable)
- **Action**: Stored in payload, handled on tap

## Files to Create/Modify

### New Files
- `lib/features/notifications/notifications_screen.dart`
- `lib/features/notifications/add_rule_sheet.dart`
- `lib/features/notifications/notification_service.dart`
- `lib/features/notifications/notification_rule.dart`
- `lib/features/notifications/notifications_provider.dart`

### Modified Files
- `lib/features/settings/settings_drawer.dart` - wire up Notifications tile
- `lib/core/websocket/websocket_service.dart` - trigger notifications
- `android/app/src/main/res/drawable/` - notification icon
- `pubspec.yaml` - add flutter_local_notifications

## Dependencies

```yaml
flutter_local_notifications: ^17.0.0
```

## Android Setup

- Add notification icon to drawable
- Notification channel: "orchon_alerts"
- Request permission on first rule creation
