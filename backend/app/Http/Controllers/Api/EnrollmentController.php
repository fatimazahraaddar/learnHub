<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    private function isPrivileged(Request $request): bool
    {
        return in_array((string) $request->user()?->role, ['admin', 'trainer'], true);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Enrollment::with(['user', 'course']);

        if (! $this->isPrivileged($request)) {
            $query->where('user_id', $request->user()->id);
        }

        if ($request->filled('user_id')) {
            $requestedUserId = $request->integer('user_id');
            if (! $this->isPrivileged($request) && $requestedUserId !== $request->user()->id) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }

            $query->where('user_id', $requestedUserId);
        }

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->integer('course_id'));
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'progress' => ['nullable', 'integer', 'between:0,100'],
            'status' => ['nullable', 'string', 'max:255'],
            'enrolled_at' => ['nullable', 'date'],
            'completed_at' => ['nullable', 'date'],
        ]);

        if (! $this->isPrivileged($request) && (int) $validated['user_id'] !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $enrollment = Enrollment::create($validated)->load(['user', 'course']);

        return response()->json($enrollment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Enrollment $enrollment): JsonResponse
    {
        if (! $this->isPrivileged($request) && (int) $enrollment->user_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($enrollment->load(['user', 'course']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Enrollment $enrollment): JsonResponse
    {
        if (! $this->isPrivileged($request) && (int) $enrollment->user_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $validated = $request->validate([
            'user_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'course_id' => ['sometimes', 'required', 'integer', 'exists:courses,id'],
            'progress' => ['nullable', 'integer', 'between:0,100'],
            'status' => ['nullable', 'string', 'max:255'],
            'enrolled_at' => ['nullable', 'date'],
            'completed_at' => ['nullable', 'date'],
        ]);

        if (! $this->isPrivileged($request) && array_key_exists('user_id', $validated) && (int) $validated['user_id'] !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $enrollment->update($validated);

        return response()->json($enrollment->refresh()->load(['user', 'course']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Enrollment $enrollment): JsonResponse
    {
        if (! $this->isPrivileged($request) && (int) $enrollment->user_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $enrollment->delete();

        return response()->json(['message' => 'Enrollment deleted']);
    }
}
