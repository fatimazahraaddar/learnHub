<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(
            Testimonial::with(['user', 'course'])->latest()->paginate(15)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'course_id' => ['nullable', 'integer', 'exists:courses,id'],
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'avatar_url' => ['nullable', 'url'],
            'text' => ['required', 'string'],
            'rating' => ['nullable', 'integer', 'between:1,5'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $testimonial = Testimonial::create($validated)->load(['user', 'course']);

        return response()->json($testimonial, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimonial $testimonial): JsonResponse
    {
        return response()->json($testimonial->load(['user', 'course']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'course_id' => ['nullable', 'integer', 'exists:courses,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'avatar_url' => ['nullable', 'url'],
            'text' => ['sometimes', 'required', 'string'],
            'rating' => ['nullable', 'integer', 'between:1,5'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $testimonial->update($validated);

        return response()->json($testimonial->refresh()->load(['user', 'course']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();

        return response()->json(['message' => 'Testimonial deleted']);
    }
}
