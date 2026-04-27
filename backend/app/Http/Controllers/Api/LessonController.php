<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(
            Lesson::with(['module.course'])->orderBy('module_id')->orderBy('position')->paginate(25)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'module_id' => ['required', 'integer', 'exists:modules,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'url'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'position' => ['nullable', 'integer', 'min:1'],
            'is_preview' => ['nullable', 'boolean'],
        ]);

        $lesson = Lesson::create($validated)->load(['module.course']);

        return response()->json($lesson, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Lesson $lesson): JsonResponse
    {
        return response()->json($lesson->load(['module.course']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lesson $lesson): JsonResponse
    {
        $validated = $request->validate([
            'module_id' => ['sometimes', 'required', 'integer', 'exists:modules,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'url'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'position' => ['nullable', 'integer', 'min:1'],
            'is_preview' => ['nullable', 'boolean'],
        ]);

        $lesson->update($validated);

        return response()->json($lesson->refresh()->load(['module.course']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lesson $lesson): JsonResponse
    {
        $lesson->delete();

        return response()->json(['message' => 'Lesson deleted']);
    }
}
