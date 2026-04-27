<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(TeamMember::orderBy('display_order')->paginate(20));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'image_url' => ['nullable', 'url'],
            'bio' => ['nullable', 'string'],
            'linkedin_url' => ['nullable', 'url'],
            'twitter_url' => ['nullable', 'url'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $member = TeamMember::create($validated);

        return response()->json($member, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TeamMember $teamMember): JsonResponse
    {
        return response()->json($teamMember);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TeamMember $teamMember): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'role' => ['sometimes', 'required', 'string', 'max:255'],
            'image_url' => ['nullable', 'url'],
            'bio' => ['nullable', 'string'],
            'linkedin_url' => ['nullable', 'url'],
            'twitter_url' => ['nullable', 'url'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $teamMember->update($validated);

        return response()->json($teamMember->refresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeamMember $teamMember): JsonResponse
    {
        $teamMember->delete();

        return response()->json(['message' => 'Team member deleted']);
    }
}
