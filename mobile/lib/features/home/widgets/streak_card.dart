import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class StreakCard extends StatelessWidget {
  const StreakCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFFFF7ED), Color(0xFFFFEDD5)],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFFED7AA)),
        ),
        child: Row(
          children: [
            const Text('🔥', style: TextStyle(fontSize: 40)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '12 दिवस सलग!',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.brandOrangeDark,
                    ),
                  ),
                  const Text(
                    'तुम्ही आज पण शिकलात तर १३ दिवस!',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.gray500,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Streak dots
                  Row(
                    children: List.generate(7, (i) {
                      final isActive = i < 5;
                      final isToday = i == 4;
                      return Container(
                        margin: const EdgeInsets.only(right: 4),
                        height: 28,
                        width: 28,
                        decoration: BoxDecoration(
                          color: isActive
                              ? (isToday ? AppColors.brandOrange : const Color(0xFFFB923C))
                              : AppColors.gray200,
                          shape: BoxShape.circle,
                          border: isToday
                              ? Border.all(color: AppColors.brandOrange, width: 2)
                              : null,
                        ),
                        child: Center(
                          child: Text(
                            isActive ? '✓' : '',
                            style: TextStyle(
                              color: isActive ? Colors.white : Colors.transparent,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      );
                    }),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
