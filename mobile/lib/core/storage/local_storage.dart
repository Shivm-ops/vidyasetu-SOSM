import 'package:hive_flutter/hive_flutter.dart';

class LocalStorage {
  static late Box _authBox;
  static late Box _settingsBox;
  static late Box _offlineLessonsBox;
  static late Box _progressBox;

  static Future<void> init() async {
    _authBox = await Hive.openBox('auth');
    _settingsBox = await Hive.openBox('settings');
    _offlineLessonsBox = await Hive.openBox('offline_lessons');
    _progressBox = await Hive.openBox('progress');
  }

  // Auth
  static String? get accessToken => _authBox.get('access_token');
  static String? get refreshToken => _authBox.get('refresh_token');
  static Map? get user => _authBox.get('user') as Map?;

  static Future<void> saveTokens(String access, String refresh) async {
    await _authBox.put('access_token', access);
    await _authBox.put('refresh_token', refresh);
  }

  static Future<void> saveUser(Map user) async {
    await _authBox.put('user', user);
  }

  static Future<void> clearAuth() async {
    await _authBox.deleteAll(['access_token', 'refresh_token', 'user']);
  }

  // Settings
  static String get language => _settingsBox.get('language', defaultValue: 'mr');
  static bool get isOfflineMode => _settingsBox.get('offline_mode', defaultValue: false);

  static Future<void> setLanguage(String lang) => _settingsBox.put('language', lang);
  static Future<void> setOfflineMode(bool val) => _settingsBox.put('offline_mode', val);

  // Offline Lessons
  static Future<void> cacheLesson(String lessonId, Map data) async {
    await _offlineLessonsBox.put(lessonId, data);
  }

  static Map? getCachedLesson(String lessonId) =>
      _offlineLessonsBox.get(lessonId) as Map?;

  static List<String> get cachedLessonIds =>
      _offlineLessonsBox.keys.cast<String>().toList();

  // Progress (offline queue)
  static Future<void> queueProgressSync(Map data) async {
    final queue = _progressBox.get('sync_queue', defaultValue: <dynamic>[]) as List;
    queue.add(data);
    await _progressBox.put('sync_queue', queue);
  }

  static List get pendingSyncItems =>
      _progressBox.get('sync_queue', defaultValue: <dynamic>[]) as List;

  static Future<void> clearSyncQueue() => _progressBox.delete('sync_queue');
}
