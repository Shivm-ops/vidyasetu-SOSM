import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../learn/widgets/subject_grid.dart';
import '../widgets/greeting_header.dart';
import '../widgets/streak_card.dart';
import '../widgets/mood_checkin_widget.dart';
import '../widgets/ai_tutor_fab.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentIndex = 0;

  final _pages = const [
    _DashboardTab(),
    _LearnTab(),
    _CareerTab(),
    _CommunityTab(),
    _ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: _buildBottomNav(),
      floatingActionButton: _currentIndex == 0 ? const AITutorFab() : null,
    );
  }

  Widget _buildBottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _NavItem(icon: Icons.home_rounded, label: 'मुखपृष्ठ', index: 0, current: _currentIndex, onTap: _setTab),
              _NavItem(icon: Icons.menu_book_rounded, label: 'शिका', index: 1, current: _currentIndex, onTap: _setTab),
              _NavItem(icon: Icons.explore_rounded, label: 'करिअर', index: 2, current: _currentIndex, onTap: _setTab),
              _NavItem(icon: Icons.people_rounded, label: 'समाज', index: 3, current: _currentIndex, onTap: _setTab),
              _NavItem(icon: Icons.person_rounded, label: 'प्रोफाइल', index: 4, current: _currentIndex, onTap: _setTab),
            ],
          ),
        ),
      ),
    );
  }

  void _setTab(int index) => setState(() => _currentIndex = index);
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final int index;
  final int current;
  final ValueChanged<int> onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.index,
    required this.current,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isActive = index == current;
    return InkWell(
      onTap: () => onTap(index),
      borderRadius: BorderRadius.circular(12),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isActive ? AppColors.brandOrangeLight : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isActive ? AppColors.brandOrange : AppColors.gray500,
              size: 22,
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                color: isActive ? AppColors.brandOrange : AppColors.gray500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Tab placeholders
class _DashboardTab extends ConsumerWidget {
  const _DashboardTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return CustomScrollView(
      slivers: [
        const SliverToBoxAdapter(child: GreetingHeader()),
        const SliverToBoxAdapter(child: SizedBox(height: 16)),
        const SliverToBoxAdapter(child: StreakCard()),
        const SliverToBoxAdapter(child: SizedBox(height: 16)),
        const SliverToBoxAdapter(child: MoodCheckInWidget()),
        const SliverToBoxAdapter(child: SizedBox(height: 16)),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'विषय',
              style: Theme.of(context).textTheme.titleLarge,
            ),
          ),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 12)),
        const SliverToBoxAdapter(child: SubjectGrid()),
        const SliverPadding(padding: EdgeInsets.only(bottom: 100)),
      ],
    );
  }
}

class _LearnTab extends StatelessWidget {
  const _LearnTab();
  @override
  Widget build(BuildContext context) => const Center(
    child: Text('शिका', style: TextStyle(fontSize: 24)),
  );
}

class _CareerTab extends StatelessWidget {
  const _CareerTab();
  @override
  Widget build(BuildContext context) => const Center(
    child: Text('करिअर', style: TextStyle(fontSize: 24)),
  );
}

class _CommunityTab extends StatelessWidget {
  const _CommunityTab();
  @override
  Widget build(BuildContext context) => const Center(
    child: Text('समुदाय', style: TextStyle(fontSize: 24)),
  );
}

class _ProfileTab extends StatelessWidget {
  const _ProfileTab();
  @override
  Widget build(BuildContext context) => const Center(
    child: Text('प्रोफाइल', style: TextStyle(fontSize: 24)),
  );
}
