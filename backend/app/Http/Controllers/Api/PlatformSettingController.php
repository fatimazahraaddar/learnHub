<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PlatformSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlatformSettingController extends Controller
{
    private const PLATFORM_KEY = 'platform';

    private function defaults(): array
    {
        return [
            'site_name' => 'LearnHub',
            'tagline' => 'Empowering Learners Worldwide',
            'description' => 'A modern e-learning platform delivering world-class education to learners worldwide.',
            'support_email' => 'support@learnhub.com',
            'support_phone' => '+1 (555) 234-5678',
            'primary_color' => '#4A90E2',
            'accent_color' => '#7F3FBF',
            'nav_links' => ['Home', 'Courses', 'Blog'],
            'notification_preferences' => [
                ['label' => 'New user registration', 'email' => true, 'push' => true],
                ['label' => 'New course submission', 'email' => true, 'push' => true],
                ['label' => 'Payment received', 'email' => true, 'push' => true],
                ['label' => 'Course completion', 'email' => false, 'push' => true],
                ['label' => 'Support tickets', 'email' => false, 'push' => false],
                ['label' => 'Weekly report', 'email' => false, 'push' => false],
            ],
        ];
    }

    public function show(): JsonResponse
    {
        $setting = PlatformSetting::query()->where('key', self::PLATFORM_KEY)->first();
        $value = is_array($setting?->value) ? $setting->value : [];

        return response()->json([
            'status' => true,
            'settings' => array_replace_recursive($this->defaults(), $value),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'site_name' => ['nullable', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'support_email' => ['nullable', 'email', 'max:255'],
            'support_phone' => ['nullable', 'string', 'max:255'],
            'primary_color' => ['nullable', 'string', 'max:20'],
            'accent_color' => ['nullable', 'string', 'max:20'],
            'nav_links' => ['nullable', 'array'],
            'nav_links.*' => ['nullable', 'string', 'max:255'],
            'notification_preferences' => ['nullable', 'array'],
            'notification_preferences.*.label' => ['required_with:notification_preferences', 'string', 'max:255'],
            'notification_preferences.*.email' => ['nullable', 'boolean'],
            'notification_preferences.*.push' => ['nullable', 'boolean'],
        ]);

        $existing = PlatformSetting::query()->where('key', self::PLATFORM_KEY)->first();
        $nextValue = array_replace_recursive($this->defaults(), is_array($existing?->value) ? $existing->value : [], $validated);

        $setting = PlatformSetting::query()->updateOrCreate(
            ['key' => self::PLATFORM_KEY],
            ['value' => $nextValue]
        );

        return response()->json([
            'status' => true,
            'message' => 'Settings saved successfully.',
            'settings' => $setting->value,
        ]);
    }
}

