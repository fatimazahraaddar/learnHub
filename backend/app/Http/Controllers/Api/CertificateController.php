<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CertificateController extends Controller
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
        $query = Certificate::with(['user', 'course'])->latest();

        if (! $this->isPrivileged($request)) {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json(
            $query->paginate(20)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'code' => ['required', 'string', 'max:255', 'unique:certificates,code'],
            'file_url' => ['nullable', 'url'],
            'issued_at' => ['nullable', 'date'],
        ]);

        $certificate = Certificate::create($validated)->load(['user', 'course']);

        return response()->json($certificate, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Certificate $certificate): JsonResponse
    {
        if (! $this->isPrivileged($request) && (int) $certificate->user_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($certificate->load(['user', 'course']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Certificate $certificate): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'course_id' => ['sometimes', 'required', 'integer', 'exists:courses,id'],
            'code' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('certificates', 'code')->ignore($certificate->id)],
            'file_url' => ['nullable', 'url'],
            'issued_at' => ['nullable', 'date'],
        ]);

        $certificate->update($validated);

        return response()->json($certificate->refresh()->load(['user', 'course']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Certificate $certificate): JsonResponse
    {
        $certificate->delete();

        return response()->json(['message' => 'Certificate deleted']);
    }
}
