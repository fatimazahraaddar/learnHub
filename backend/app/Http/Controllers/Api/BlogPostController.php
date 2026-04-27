<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BlogPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(
            BlogPost::with(['author', 'category'])->latest()->paginate(15)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:blog_posts,slug'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'image_url' => ['nullable', 'url'],
            'status' => ['nullable', 'string', 'max:255'],
            'read_time_minutes' => ['nullable', 'integer', 'min:0'],
            'published_at' => ['nullable', 'date'],
        ]);

        $post = BlogPost::create($validated)->load(['author', 'category']);

        return response()->json($post, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(BlogPost $blogPost): JsonResponse
    {
        return response()->json($blogPost->load(['author', 'category']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BlogPost $blogPost): JsonResponse
    {
        $validated = $request->validate([
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('blog_posts', 'slug')->ignore($blogPost->id)],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'image_url' => ['nullable', 'url'],
            'status' => ['nullable', 'string', 'max:255'],
            'read_time_minutes' => ['nullable', 'integer', 'min:0'],
            'published_at' => ['nullable', 'date'],
        ]);

        $blogPost->update($validated);

        return response()->json($blogPost->refresh()->load(['author', 'category']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlogPost $blogPost): JsonResponse
    {
        $blogPost->delete();

        return response()->json(['message' => 'Blog post deleted']);
    }
}
