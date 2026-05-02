<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', (string) $request->input('role'));
        }

        return response()->json($query->latest()->paginate(20));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['nullable', Rule::in(['admin', 'trainer', 'learner'])],
            'image' => ['nullable', 'url'],
            'phone' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'linkedin' => ['nullable', 'url'],
            'twitter' => ['nullable', 'url'],
            'github' => ['nullable', 'url'],
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): JsonResponse
    {
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, User $user): JsonResponse
{
    // ❌ Supprimez cette ligne :
    // $user = User::findOrFail(Auth::id());

    $validated = $request->validate([
        'name'     => ['required', 'string', 'max:255'],
        'email'    => ['required', 'email', Rule::unique('users')->ignore($user->id)],
        'role'     => ['nullable', Rule::in(['admin', 'trainer', 'learner'])],
        'phone'    => ['nullable', 'string'],
        'location' => ['nullable', 'string'],
        'bio'      => ['nullable', 'string'],
        'linkedin' => ['nullable', 'url'],
        'twitter'  => ['nullable', 'url'],
        'github'   => ['nullable', 'url'],
        'image'    => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
    ]);

    if ($request->hasFile('image')) {
        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }
        $validated['image'] = $request->file('image')->store('profiles', 'public');
    }

    $user->update($validated);

    return response()->json([
        'status' => true,
        'profile' => $user->refresh()
    ]);
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = User::findOrFail(Auth::id());

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone'    => ['nullable', 'string'],
            'location' => ['nullable', 'string'],
            'bio'      => ['nullable', 'string'],
            'linkedin' => ['nullable', 'url'],
            'twitter'  => ['nullable', 'url'],
            'github'   => ['nullable', 'url'],
            'image'    => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

        if ($request->hasFile('image')) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $validated['image'] = $request->file('image')->store('profiles', 'public');
        }

        $user->update($validated);

        return response()->json([
            'status' => true,
            'profile' => $user->refresh()
        ]);
    }
}
