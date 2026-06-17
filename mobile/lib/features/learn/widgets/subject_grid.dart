import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class SubjectGrid extends StatelessWidget {
  const SubjectGrid({super.key});

  static const _subjects = [
    _Subject('मराठी',    '📖', Color(0xFFFFF7ED), AppColors.brandOrangeDark, 'MARATHI'),
    _Subject('English',   '🔤', Color(0xFFEFF6FF), Color(0xFF2563EB),         'ENGLISH'),
    _Subject('गणित',     '🔢', Color(0xFFF0FDF4), AppColors.success,         'MATH'),
    _Subject('विज्ञान',   '🔬', Color(0xFFECFEFF), AppColors.peacockBlueDark, 'SCIENCE'),
    _Subject('इतिहास',   '🏛️', Color(0xFFFFFBEB), Color(0xFFD97706),         'HISTORY'),
    _Subject('भूगोल',    '🗺️', Color(0xFFF0FDF4), Color(0xFF15803D),         'GEOGRAPHY'),
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 0.95,
        ),
        itemCount: _subjects.length,
        itemBuilder: (context, i) => _SubjectCard(subject: _subjects[i]),
      ),
    );
  }
}

class _SubjectCard extends StatelessWidget {
  final _Subject subject;
  const _SubjectCard({required this.subject});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/learn/subjects/${subject.code}'),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.gray200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: subject.bgColor,
                shape: BoxShape.circle,
              ),
              child: Text(subject.emoji, style: const TextStyle(fontSize: 24)),
            ),
            const SizedBox(height: 8),
            Text(
              subject.name,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: subject.textColor,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _Subject {
  final String name;
  final String emoji;
  final Color bgColor;
  final Color textColor;
  final String code;
  const _Subject(this.name, this.emoji, this.bgColor, this.textColor, this.code);
}
