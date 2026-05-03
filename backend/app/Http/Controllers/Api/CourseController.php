<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Lesson;
class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $courses = Course::with(['category', 'trainer'])->latest()->limit(30)->get();

        return response()->json($courses);
    }

    public function getLessons(Course $course): JsonResponse
{
    $lessons = Lesson::whereHas('module', fn($q) => $q->where('course_id', $course->id))
        ->orderBy('position')
        ->get();

    return response()->json($lessons);
}

// POST api/courses/{course}/lessons
public function saveLessons(Request $request, Course $course): JsonResponse
{
    $lessons = $request->input('lessons', []);

    $module = Module::firstOrCreate(
        ['course_id' => $course->id, 'title' => 'Main'],
        [
            'description'      => '',
            'position'         => 1,
            'duration_minutes' => 0,
            'is_preview'       => false,
        ]
    );

    Lesson::where('module_id', $module->id)->delete();

    foreach ($lessons as $idx => $l) {
        Lesson::create([
            'module_id' => $module->id,
            'title'     => $l['title'] ?? 'Untitled',
            'content'   => $l['content'] ?? '',
            'code'      => $l['code'] ?? '',
            'position'  => $idx + 1,
        ]);
    }

    return response()->json([
        'status'  => true,
        'lessons' => Lesson::where('module_id', $module->id)->orderBy('position')->get(),
    ]);
}

public function getQuizzes(Course $course): JsonResponse
{
    $quizzes = Quiz::where('course_id', $course->id)->with('questions')->get();
    return response()->json($quizzes);
}

// POST api/courses/{course}/quizzes
public function saveQuizzes(Request $request, Course $course): JsonResponse
{
    $quizzes = $request->input('quizzes', []);

    Quiz::where('course_id', $course->id)->each(function ($q) {
        $q->questions()->delete();
        $q->delete();
    });

    foreach ($quizzes as $qData) {
        $quiz = Quiz::create([
            'course_id' => $course->id,
            'title'     => $qData['title'] ?? 'Quiz',
        ]);

        foreach ($qData['questions'] ?? [] as $qu) {
            QuizQuestion::create([
                'quiz_id'  => $quiz->id,
                'question' => $qu['question'] ?? '',
                'options'  => $qu['options'] ?? [],
                'correct'  => $qu['correct'] ?? 0,
            ]);
        }
    }

    return response()->json([
        'status'  => true,
        'quizzes' => Quiz::where('course_id', $course->id)->with('questions')->get(),
    ]);
}
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'trainer_id' => ['nullable', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:courses,slug'],
            'description' => ['nullable', 'string'],
            'level' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'students_count' => ['nullable', 'integer', 'min:0'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'thumbnail_url' => ['nullable', 'url'],
            'badge' => ['nullable', 'string', 'max:255'],
            'badge_color' => ['nullable', 'string', 'max:20'],
            'status' => ['nullable', 'string', 'max:255'],
            'published_at' => ['nullable', 'date'],
        ]);

        $course = Course::create($validated)->load(['category', 'trainer']);

        return response()->json($course, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course): JsonResponse
    {
        return response()->json(
            $course->load(['category', 'trainer', 'modules.lessons'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'trainer_id' => ['nullable', 'integer', 'exists:users,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('courses', 'slug')->ignore($course->id)],
            'description' => ['nullable', 'string'],
            'level' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'students_count' => ['nullable', 'integer', 'min:0'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'thumbnail_url' => ['nullable', 'url'],
            'badge' => ['nullable', 'string', 'max:255'],
            'badge_color' => ['nullable', 'string', 'max:20'],
            'status' => ['nullable', 'string', 'max:255'],
            'published_at' => ['nullable', 'date'],
        ]);

        $course->update($validated);

        return response()->json($course->refresh()->load(['category', 'trainer']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course): JsonResponse
    {
        $course->delete();

        return response()->json(['message' => 'Course deleted']);
    }
}
