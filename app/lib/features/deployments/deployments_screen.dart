import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../core/config.dart';
import '../../core/websocket/websocket_service.dart';
import '../../core/orchon/orchon_service.dart';
import '../../core/updates/update_dialog.dart';
import '../../core/updates/update_service.dart';
import '../settings/settings_drawer.dart';
import '../threads/threads_screen.dart';
import 'widgets/deployment_card.dart';
import 'deployment_detail_screen.dart';

class DeploymentsScreen extends ConsumerStatefulWidget {
  const DeploymentsScreen({super.key});

  @override
  ConsumerState<DeploymentsScreen> createState() => _DeploymentsScreenState();
}

class _DeploymentsScreenState extends ConsumerState<DeploymentsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _initializeServices();
    });
  }

  Future<void> _initializeServices() async {
    await Future.delayed(const Duration(milliseconds: 500));
    if (!mounted) return;

    // Connect WebSocket
    try {
      final wsService = ref.read(webSocketServiceProvider);
      wsService.connect(AppConfig.wsUrl, authToken: 'dev-token');
    } catch (e) {
      debugPrint('WebSocket init error: $e');
    }

    // Fetch deployments
    try {
      await ref.read(deploymentsProvider.notifier).fetchDeployments();
    } catch (e) {
      debugPrint('Deployments fetch error: $e');
    }

    // Check for updates
    try {
      await showUpdateDialogIfAvailable(context, ref);
    } catch (e) {
      debugPrint('Update check error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final deploymentsState = ref.watch(deploymentsProvider);
    final connectionState = ref.watch(connectionStateProvider);
    final selectedOwner = ref.watch(selectedOwnerFilterProvider);
    final ownersAsync = ref.watch(ownersProvider);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            SvgPicture.asset(
              'assets/icon.svg',
              height: 28,
              width: 28,
            ),
            const SizedBox(width: 10),
            Text(
              'ORCHON',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                letterSpacing: 3,
                color: Colors.grey[400],
              ),
            ),
            const SizedBox(width: 8),
            _buildConnectionIndicator(connectionState),
          ],
        ),
        actions: [
          // Owner filter dropdown
          ownersAsync.when(
            data: (owners) => owners.length > 1
                ? PopupMenuButton<String?>(
                    icon: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.filter_list,
                          color: selectedOwner != null ? const Color(0xFF6366F1) : Colors.grey[400],
                          size: 20,
                        ),
                        if (selectedOwner != null) ...[
                          const SizedBox(width: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF6366F1).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              selectedOwner,
                              style: const TextStyle(
                                fontSize: 10,
                                color: Color(0xFF6366F1),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    tooltip: 'Filter by owner',
                    onSelected: (owner) {
                      ref.read(selectedOwnerFilterProvider.notifier).state = owner;
                    },
                    itemBuilder: (context) => [
                      PopupMenuItem<String?>(
                        value: null,
                        child: Row(
                          children: [
                            Icon(
                              selectedOwner == null ? Icons.radio_button_checked : Icons.radio_button_off,
                              size: 18,
                              color: selectedOwner == null ? const Color(0xFF6366F1) : Colors.grey,
                            ),
                            const SizedBox(width: 8),
                            const Text('All'),
                          ],
                        ),
                      ),
                      const PopupMenuDivider(),
                      ...owners.map((owner) => PopupMenuItem<String?>(
                        value: owner,
                        child: Row(
                          children: [
                            Icon(
                              selectedOwner == owner ? Icons.radio_button_checked : Icons.radio_button_off,
                              size: 18,
                              color: selectedOwner == owner ? const Color(0xFF6366F1) : Colors.grey,
                            ),
                            const SizedBox(width: 8),
                            Text(owner),
                          ],
                        ),
                      )),
                    ],
                  )
                : const SizedBox.shrink(),
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
          ),
          Builder(
            builder: (context) {
              final updateState = ref.watch(updateProvider);
              final hasUpdate = updateState.hasUpdate;

              return IconButton(
                icon: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    const Icon(Icons.dashboard_customize_outlined),
                    if (hasUpdate)
                      Positioned(
                        right: -4,
                        top: -4,
                        child: Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: Colors.orange,
                            shape: BoxShape.circle,
                            border: Border.all(color: const Color(0xFF1A1A2E), width: 1.5),
                          ),
                        ),
                      ),
                  ],
                ),
                onPressed: () {
                  Scaffold.of(context).openEndDrawer();
                },
              );
            },
          ),
        ],
      ),
      endDrawer: const SettingsDrawer(),
      body: RefreshIndicator(
        onRefresh: () => ref.read(deploymentsProvider.notifier).refresh(),
        child: deploymentsState.isLoading && deploymentsState.deployments.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : deploymentsState.error != null && deploymentsState.deployments.isEmpty
                ? _buildErrorState(deploymentsState.error!)
                : deploymentsState.deployments.isEmpty
                    ? _buildEmptyState()
                    : _buildDeploymentsList(deploymentsState),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showNewThreadSheet(context),
        icon: const Icon(Icons.add),
        label: const Text('New Thread'),
      ),
    );
  }

  Widget _buildConnectionIndicator(AsyncValue<WsConnectionState> connectionState) {
    return connectionState.when(
      data: (state) {
        final Color color;
        final String tooltip;
        switch (state) {
          case WsConnectionState.authenticated:
            color = Colors.green;
            tooltip = 'Connected & authenticated';
          case WsConnectionState.connected:
            color = Colors.lightGreen;
            tooltip = 'Connected, authenticating...';
          case WsConnectionState.connecting:
            color = Colors.orange;
            tooltip = 'Connecting...';
          case WsConnectionState.disconnected:
            color = Colors.grey;
            tooltip = 'Disconnected';
          case WsConnectionState.error:
            color = Colors.red;
            tooltip = 'Connection error';
        }
        return Tooltip(
          message: tooltip,
          child: Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
        );
      },
      loading: () => Container(
        width: 8,
        height: 8,
        decoration: const BoxDecoration(
          color: Colors.orange,
          shape: BoxShape.circle,
        ),
      ),
      error: (_, __) => Container(
        width: 8,
        height: 8,
        decoration: const BoxDecoration(
          color: Colors.red,
          shape: BoxShape.circle,
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.rocket_launch_outlined,
            size: 64,
            color: Colors.grey[600],
          ),
          const SizedBox(height: 16),
          Text(
            'No deployments yet',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey[400],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Pull to refresh or wait for activity',
            style: TextStyle(
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(String error) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.cloud_off,
              size: 64,
              color: Colors.red[400],
            ),
            const SizedBox(height: 16),
            Text(
              'Failed to load deployments',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[400],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              error,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: () => ref.read(deploymentsProvider.notifier).refresh(),
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeploymentsList(DeploymentsState state) {
    final selectedOwner = ref.watch(selectedOwnerFilterProvider);

    // Filter deployments by owner if selected
    final filteredDeployments = selectedOwner != null
        ? state.deployments.where((d) =>
            d.owner?.toLowerCase() == selectedOwner.toLowerCase()
          ).toList()
        : state.deployments;

    if (filteredDeployments.isEmpty && selectedOwner != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.filter_alt_off, size: 64, color: Colors.grey[600]),
            const SizedBox(height: 16),
            Text(
              'No deployments for "$selectedOwner"',
              style: TextStyle(fontSize: 18, color: Colors.grey[400]),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => ref.read(selectedOwnerFilterProvider.notifier).state = null,
              child: const Text('Clear filter'),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: filteredDeployments.length,
      itemBuilder: (context, index) {
        final deployment = filteredDeployments[index];
        return DeploymentCard(
          deployment: deployment,
          onTap: () => _openDeploymentDetail(deployment),
        );
      },
    );
  }

  void _openDeploymentDetail(deployment) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DeploymentDetailScreen(deployment: deployment),
      ),
    );
  }

  void _showNewThreadSheet(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const ThreadsScreen(),
      ),
    );
  }
}
