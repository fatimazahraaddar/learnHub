<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\PlatformSettingController;
use App\Http\Controllers\Api\SubscriptionPlanController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserSubscriptionController;
use App\Http\Controllers\Api\AnalyticsController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('contact', [ContactController::class, 'store']);

Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);

// ✅ Spécifiques AVANT apiResource pour éviter les conflits
Route::get('courses/{course}/lessons', [CourseController::class, 'getLessons']);
Route::get('courses/{course}/quizzes', [CourseController::class, 'getQuizzes']);

Route::apiResource('courses', CourseController::class)->only(['index', 'show']);
Route::apiResource('blog-posts', BlogPostController::class)->only(['index', 'show']);
Route::apiResource('testimonials', TestimonialController::class)->only(['index', 'show']);
Route::apiResource('team-members', TeamMemberController::class)->only(['index', 'show']);
Route::apiResource('subscription-plans', SubscriptionPlanController::class)->only(['index', 'show']);
Route::get('platform-settings', [PlatformSettingController::class, 'show']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::post('auth/logout-all', [AuthController::class, 'logoutAll']);
    Route::post('uploads/images', [UploadController::class, 'image']);

    Route::get('profile', [UserController::class, 'profile']);
    Route::put('profile', [UserController::class, 'updateProfile']);

    Route::apiResource('enrollments', EnrollmentController::class);
    Route::apiResource('messages', MessageController::class);
    Route::post('blog-posts', [BlogPostController::class, 'store']);
    Route::apiResource('certificates', CertificateController::class)->only(['index', 'show']);
    Route::put('/certificates/{id}', [CertificateController::class, 'update']);

    Route::middleware('role:admin')->group(function (): void {
        Route::apiResource('users', UserController::class);
        Route::apiResource('user-subscriptions', UserSubscriptionController::class);
        Route::put('platform-settings', [PlatformSettingController::class, 'update']);
    });

    Route::middleware('role:admin,trainer')->group(function (): void {
        Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);
        Route::get('analytics/trainer', [AnalyticsController::class, 'trainer']);
        Route::apiResource('courses', CourseController::class)->only(['store', 'update', 'destroy']);

        // ✅ Save lessons & quizzes protégés (admin/trainer seulement)
        Route::post('courses/{course}/lessons', [CourseController::class, 'saveLessons']);
        Route::post('courses/{course}/quizzes', [CourseController::class, 'saveQuizzes']);

        Route::apiResource('modules', ModuleController::class);
        Route::apiResource('lessons', LessonController::class);
        Route::apiResource('blog-posts', BlogPostController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('testimonials', TestimonialController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('team-members', TeamMemberController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('subscription-plans', SubscriptionPlanController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('certificates', CertificateController::class)->only(['store', 'update', 'destroy']);
    });
});