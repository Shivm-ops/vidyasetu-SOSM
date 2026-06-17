import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameCtrl = TextEditingController();
  final _lastNameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  int _selectedGrade = 8;
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('नोंदणी करा'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'विद्यासेतूमध्ये स्वागत! 🎉',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: AppColors.gray900,
                ),
              ),
              const Text(
                'तुमची माहिती भरा',
                style: TextStyle(color: AppColors.gray500, fontSize: 14),
              ),
              const SizedBox(height: 28),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _firstNameCtrl,
                      decoration: const InputDecoration(labelText: 'पहिले नाव'),
                      validator: (v) => v?.isEmpty ?? true ? 'आवश्यक' : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      controller: _lastNameCtrl,
                      decoration: const InputDecoration(labelText: 'आडनाव'),
                      validator: (v) => v?.isEmpty ?? true ? 'आवश्यक' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'मोबाइल नंबर',
                  prefixText: '+91 ',
                ),
                validator: (v) {
                  if (v?.length != 10) return 'वैध मोबाइल नंबर टाका';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Grade selector
              DropdownButtonFormField<int>(
                value: _selectedGrade,
                decoration: const InputDecoration(labelText: 'इयत्ता'),
                items: List.generate(12, (i) => i + 1)
                    .map((g) => DropdownMenuItem(value: g, child: Text('इयत्ता $g')))
                    .toList(),
                onChanged: (v) => setState(() => _selectedGrade = v!),
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _passwordCtrl,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'पासवर्ड तयार करा'),
                validator: (v) {
                  if ((v?.length ?? 0) < 6) return 'किमान ६ अक्षरे आवश्यक';
                  return null;
                },
              ),
              const SizedBox(height: 28),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading
                      ? null
                      : () async {
                          if (!_formKey.currentState!.validate()) return;
                          setState(() => _isLoading = true);
                          await Future.delayed(const Duration(seconds: 1));
                          setState(() => _isLoading = false);
                          if (mounted) context.go('/home');
                        },
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text('नोंदणी करा'),
                ),
              ),

              const SizedBox(height: 16),
              Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('आधीच खाते आहे?',
                        style: TextStyle(color: AppColors.gray500)),
                    TextButton(
                      onPressed: () => context.pop(),
                      child: const Text('लॉगिन करा'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
