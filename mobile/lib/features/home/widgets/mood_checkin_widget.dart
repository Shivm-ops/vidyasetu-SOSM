import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class MoodCheckInWidget extends StatefulWidget {
  const MoodCheckInWidget({super.key});

  @override
  State<MoodCheckInWidget> createState() => _MoodCheckInWidgetState();
}

class _MoodCheckInWidgetState extends State<MoodCheckInWidget> {
  int? _selectedMood;
  bool _submitted = false;

  final _moods = [
    ('😄', 'खूप आनंदी'),
    ('😊', 'आनंदी'),
    ('😐', 'ठीक'),
    ('😢', 'दुःखी'),
    ('😰', 'काळजीत'),
    ('😴', 'थकलेलो'),
  ];

  @override
  Widget build(BuildContext context) {
    if (_submitted) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.forestGreenLight,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFBBF7D0)),
          ),
          child: const Row(
            children: [
              Text('💚', style: TextStyle(fontSize: 24)),
              SizedBox(width: 12),
              Text(
                'धन्यवाद! भावना नोंदवली.',
                style: TextStyle(
                  color: AppColors.success,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.gray200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'आज तुम्हाला कसे वाटत आहे?',
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(_moods.length, (i) {
                final isSelected = _selectedMood == i;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedMood = i;
                      _submitted = true;
                    });
                    // TODO: API call
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.brandOrangeLight : Colors.transparent,
                      borderRadius: BorderRadius.circular(12),
                      border: isSelected
                          ? Border.all(color: AppColors.brandOrange)
                          : null,
                    ),
                    child: Column(
                      children: [
                        Text(
                          _moods[i].$1,
                          style: TextStyle(
                            fontSize: isSelected ? 28 : 24,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _moods[i].$2,
                          style: const TextStyle(fontSize: 8, color: AppColors.gray500),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ),
          ],
        ),
      ),
    );
  }
}
