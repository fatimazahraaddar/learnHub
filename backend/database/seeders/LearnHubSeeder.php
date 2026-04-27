<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Message;
use App\Models\Module;
use App\Models\SubscriptionPlan;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class LearnHubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = collect([
            ['name' => 'Development', 'slug' => 'development', 'icon' => 'code', 'color' => '#4A90E2'],
            ['name' => 'Data Science', 'slug' => 'data-science', 'icon' => 'chart', 'color' => '#7F3FBF'],
            ['name' => 'Marketing', 'slug' => 'marketing', 'icon' => 'megaphone', 'color' => '#FF7A00'],
            ['name' => 'Design', 'slug' => 'design', 'icon' => 'palette', 'color' => '#28A745'],
            ['name' => 'Business', 'slug' => 'business', 'icon' => 'briefcase', 'color' => '#2563EB'],
            ['name' => 'Creative', 'slug' => 'creative', 'icon' => 'camera', 'color' => '#0EA5E9'],
        ])->map(fn (array $data) => Category::create($data));

        $adminEmail = env('ADMIN_EMAIL', 'admin@learnhub.com');
        $adminPassword = env('ADMIN_PASSWORD', 'Admin@2026#LearnHub');

        $admin = User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Admin LearnHub',
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
                'phone' => '+212600000001',
                'location' => 'Casablanca',
            ]
        );

        $trainer = User::updateOrCreate(
            ['email' => 'trainer@learnhub.test'],
            [
                'name' => 'Sarah Johnson',
                'password' => Hash::make('Trainer@2026#LearnHub'),
                'role' => 'trainer',
                'phone' => '+212600000002',
                'location' => 'Rabat',
                'bio' => 'Full-stack trainer focused on practical projects.',
                'linkedin' => 'https://linkedin.com/in/sarah-johnson',
            ]
        );

        $learner = User::updateOrCreate(
            ['email' => 'learner@learnhub.test'],
            [
                'name' => 'Youssef Amrani',
                'password' => Hash::make('Learner@2026#LearnHub'),
                'role' => 'learner',
                'phone' => '+212600000003',
                'location' => 'Marrakech',
            ]
        );

        $course1 = Course::create([
            'category_id' => $categories->firstWhere('slug', 'development')->id,
            'trainer_id' => $trainer->id,
            'title' => 'Complete Web Development Bootcamp',
            'slug' => 'complete-web-development-bootcamp',
            'description' => 'Learn HTML, CSS, JavaScript, React and Laravel.',
            'level' => 'beginner',
            'price' => 89.99,
            'rating' => 4.8,
            'students_count' => 12450,
            'duration_minutes' => 2520,
            'thumbnail_url' => 'https://images.unsplash.com/photo-1565229284535-2cbbe3049123',
            'badge' => 'Bestseller',
            'badge_color' => '#FF7A00',
            'status' => 'published',
            'published_at' => now()->subWeeks(8),
        ]);

        $course2 = Course::create([
            'category_id' => $categories->firstWhere('slug', 'data-science')->id,
            'trainer_id' => $trainer->id,
            'title' => 'Data Science and Machine Learning',
            'slug' => 'data-science-machine-learning',
            'description' => 'From Python basics to model deployment.',
            'level' => 'intermediate',
            'price' => 119.99,
            'rating' => 4.9,
            'students_count' => 8920,
            'duration_minutes' => 3360,
            'thumbnail_url' => 'https://images.unsplash.com/photo-1762279389083-abf71f22d338',
            'badge' => 'Top Rated',
            'badge_color' => '#7F3FBF',
            'status' => 'published',
            'published_at' => now()->subWeeks(5),
        ]);

        $module1 = Module::create([
            'course_id' => $course1->id,
            'title' => 'Introduction to Web Development',
            'description' => 'Program setup and roadmap.',
            'position' => 1,
            'duration_minutes' => 150,
            'is_preview' => true,
        ]);

        $module2 = Module::create([
            'course_id' => $course1->id,
            'title' => 'Frontend Fundamentals',
            'description' => 'HTML, CSS and JavaScript fundamentals.',
            'position' => 2,
            'duration_minutes' => 360,
            'is_preview' => false,
        ]);

        Lesson::create([
            'module_id' => $module1->id,
            'title' => 'Welcome and Course Structure',
            'content' => 'How the bootcamp is organized.',
            'duration_minutes' => 20,
            'position' => 1,
            'is_preview' => true,
        ]);

        Lesson::create([
            'module_id' => $module1->id,
            'title' => 'Developer Environment Setup',
            'content' => 'Install VSCode, Git, and PHP tools.',
            'duration_minutes' => 35,
            'position' => 2,
            'is_preview' => true,
        ]);

        Lesson::create([
            'module_id' => $module2->id,
            'title' => 'HTML Essentials',
            'content' => 'Elements, structure, and semantic tags.',
            'duration_minutes' => 45,
            'position' => 1,
            'is_preview' => false,
        ]);

        Lesson::create([
            'module_id' => $module2->id,
            'title' => 'CSS Layouts and Flexbox',
            'content' => 'Build responsive layouts with flexbox.',
            'duration_minutes' => 50,
            'position' => 2,
            'is_preview' => false,
        ]);

        Enrollment::create([
            'user_id' => $learner->id,
            'course_id' => $course1->id,
            'progress' => 65,
            'status' => 'active',
            'enrolled_at' => now()->subDays(20),
        ]);

        Enrollment::create([
            'user_id' => $learner->id,
            'course_id' => $course2->id,
            'progress' => 30,
            'status' => 'active',
            'enrolled_at' => now()->subDays(12),
        ]);

        $starterPlan = SubscriptionPlan::create([
            'name' => 'Starter',
            'slug' => 'starter',
            'price' => 29.00,
            'period' => 'month',
            'color' => '#4A90E2',
            'is_popular' => false,
            'is_active' => true,
            'features' => ['Access to 50+ courses', 'HD video quality', 'Certificate of completion'],
            'disabled_features' => ['Priority support', 'Offline downloads', '1-on-1 mentoring'],
        ]);

        SubscriptionPlan::create([
            'name' => 'Pro',
            'slug' => 'pro',
            'price' => 59.00,
            'period' => 'month',
            'color' => '#7F3FBF',
            'is_popular' => true,
            'is_active' => true,
            'features' => ['Access to 500+ courses', '4K video quality', 'Offline downloads'],
            'disabled_features' => ['1-on-1 mentoring'],
        ]);

        UserSubscription::create([
            'user_id' => $learner->id,
            'subscription_plan_id' => $starterPlan->id,
            'status' => 'active',
            'starts_at' => now()->subDays(20),
            'ends_at' => now()->addDays(10),
            'renewal_at' => now()->addDays(10),
            'auto_renew' => true,
        ]);

        BlogPost::create([
            'author_id' => $trainer->id,
            'category_id' => $categories->firstWhere('slug', 'development')->id,
            'title' => '10 Skills Every Developer Needs in 2026',
            'slug' => '10-skills-every-developer-needs-in-2026',
            'excerpt' => 'A practical list of the most valuable developer skills this year.',
            'content' => 'Long-form article content goes here.',
            'image_url' => 'https://images.unsplash.com/photo-1565229284535-2cbbe3049123',
            'status' => 'published',
            'read_time_minutes' => 5,
            'published_at' => now()->subDays(30),
        ]);

        Testimonial::create([
            'user_id' => $learner->id,
            'course_id' => $course1->id,
            'name' => $learner->name,
            'role' => 'Learner',
            'text' => 'The web bootcamp helped me build real projects quickly.',
            'rating' => 5,
            'is_featured' => true,
        ]);

        TeamMember::create([
            'name' => 'Dr. Angela Roberts',
            'role' => 'CEO and Co-Founder',
            'bio' => 'Former EdTech executive with 15 years of experience.',
            'display_order' => 1,
            'is_active' => true,
        ]);

        Certificate::create([
            'user_id' => $learner->id,
            'course_id' => $course1->id,
            'code' => 'CERT-'.Str::upper(Str::random(10)),
            'issued_at' => now()->subDays(2),
        ]);

        Message::create([
            'sender_id' => $trainer->id,
            'receiver_id' => $learner->id,
            'subject' => 'Welcome',
            'body' => 'Welcome to the bootcamp. Reach out anytime if you need support.',
        ]);

        Message::create([
            'sender_id' => $admin->id,
            'receiver_id' => $trainer->id,
            'subject' => 'Platform update',
            'body' => 'New analytics dashboard is now available for trainers.',
        ]);
    }
}
