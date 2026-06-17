import 'package:flutter/material.dart';

class AppColors {
  // VidyaSetu Brand - Saffron primary
  static const brandOrange = Color(0xFFF97316);
  static const brandOrangeLight = Color(0xFFFFF7ED);
  static const brandOrangeDark = Color(0xFFEA580C);

  // Peacock blue accent
  static const peacockBlue = Color(0xFF06B6D4);
  static const peacockBlueLight = Color(0xFFECFEFF);
  static const peacockBlueDark = Color(0xFF0891B2);

  // Earth / success green
  static const forestGreen = Color(0xFF22C55E);
  static const forestGreenLight = Color(0xFFF0FDF4);

  // Neutrals
  static const gray50  = Color(0xFFF9FAFB);
  static const gray100 = Color(0xFFF3F4F6);
  static const gray200 = Color(0xFFE5E7EB);
  static const gray500 = Color(0xFF6B7280);
  static const gray700 = Color(0xFF374151);
  static const gray900 = Color(0xFF111827);

  // Semantic
  static const success = Color(0xFF16A34A);
  static const warning = Color(0xFFD97706);
  static const error   = Color(0xFFDC2626);
}

class AppTheme {
  static ThemeData get light => ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.brandOrange,
      primary: AppColors.brandOrange,
      secondary: AppColors.peacockBlue,
      surface: Colors.white,
      background: AppColors.gray50,
    ),
    fontFamily: 'NotoSansDevanagari',
    scaffoldBackgroundColor: AppColors.gray50,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: AppColors.gray900,
      elevation: 0,
      scrolledUnderElevation: 1,
      centerTitle: false,
      titleTextStyle: TextStyle(
        fontFamily: 'NotoSansDevanagari',
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: AppColors.gray900,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.brandOrange,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        textStyle: const TextStyle(
          fontFamily: 'NotoSansDevanagari',
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    cardTheme: CardTheme(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.gray200),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.gray50,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.gray200),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.gray200),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.brandOrange, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: Colors.white,
      selectedItemColor: AppColors.brandOrange,
      unselectedItemColor: AppColors.gray500,
      elevation: 8,
      type: BottomNavigationBarType.fixed,
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontFamily: 'NotoSansDevanagari',
        fontSize: 32,
        fontWeight: FontWeight.w700,
        color: AppColors.gray900,
      ),
      titleLarge: TextStyle(
        fontFamily: 'NotoSansDevanagari',
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: AppColors.gray900,
      ),
      bodyLarge: TextStyle(
        fontFamily: 'NotoSansDevanagari',
        fontSize: 16,
        color: AppColors.gray700,
        height: 1.6,
      ),
      bodyMedium: TextStyle(
        fontFamily: 'NotoSansDevanagari',
        fontSize: 14,
        color: AppColors.gray700,
        height: 1.5,
      ),
      labelSmall: TextStyle(
        fontFamily: 'NotoSansDevanagari',
        fontSize: 11,
        color: AppColors.gray500,
      ),
    ),
  );

  static ThemeData get dark => light.copyWith(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: const Color(0xFF0F0F0F),
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.brandOrange,
      brightness: Brightness.dark,
      primary: AppColors.brandOrange,
    ),
  );
}
