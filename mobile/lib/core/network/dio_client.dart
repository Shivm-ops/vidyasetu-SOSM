import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../storage/local_storage.dart';

class DioClient {
  static Dio? _instance;

  static Dio get instance {
    _instance ??= _createDio();
    return _instance!;
  }

  static Dio _createDio() {
    final dio = Dio(
      BaseOptions(
        baseUrl: '${const String.fromEnvironment('API_URL', defaultValue: 'http://localhost:3001')}/api/v1',
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 30),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = LocalStorage.accessToken;
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          // Language header
          options.headers['Accept-Language'] = LocalStorage.language;
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            // Try refresh
            final refreshToken = LocalStorage.refreshToken;
            if (refreshToken != null) {
              try {
                final refreshDio = Dio();
                final response = await refreshDio.post(
                  '${const String.fromEnvironment('API_URL', defaultValue: 'http://localhost:3001')}/api/v1/auth/refresh',
                  data: {'refreshToken': refreshToken},
                );
                final newAccess = response.data['data']['accessToken'];
                final newRefresh = response.data['data']['refreshToken'];
                await LocalStorage.saveTokens(newAccess, newRefresh);
                error.requestOptions.headers['Authorization'] = 'Bearer $newAccess';
                final retryResponse = await dio.fetch(error.requestOptions);
                handler.resolve(retryResponse);
                return;
              } catch (_) {
                await LocalStorage.clearAuth();
              }
            }
          }
          handler.next(error);
        },
      ),
    );

    if (kDebugMode) {
      dio.interceptors.add(LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (obj) => debugPrint(obj.toString()),
      ));
    }

    return dio;
  }
}
