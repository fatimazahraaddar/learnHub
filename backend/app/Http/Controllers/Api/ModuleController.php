<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module as CourseModule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(
            CourseModule::with(['course'])->orderBy('course_id')->orderBy('position')->paginate(20)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'position' => ['nullable', 'integer', 'min:1'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'is_preview' => ['nullable', 'boolean'],
        ]);

        $module = CourseModule::create($validated)->load(['course']);

        return response()->json($module, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseModule $module): JsonResponse
    {
        return response()->json($module->load(['course', 'lessons']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseModule $module): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => ['sometimes', 'required', 'integer', 'exists:courses,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'position' => ['nullable', 'integer', 'min:1'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'is_preview' => ['nullable', 'boolean'],
        ]);

        $module->update($validated);

        return response()->json($module->refresh()->load(['course', 'lessons']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseModule $module): JsonResponse
    {
        $module->delete();

        return response()->json(['message' => 'Module deleted']);
    }
}
