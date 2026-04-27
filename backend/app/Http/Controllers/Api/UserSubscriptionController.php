<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserSubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = UserSubscription::with(['user', 'subscriptionPlan']);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        return response()->json($query->latest()->paginate(20));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'subscription_plan_id' => ['required', 'integer', 'exists:subscription_plans,id'],
            'status' => ['nullable', 'string', 'max:255'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
            'renewal_at' => ['nullable', 'date'],
            'auto_renew' => ['nullable', 'boolean'],
        ]);

        $subscription = UserSubscription::create($validated)->load(['user', 'subscriptionPlan']);

        return response()->json($subscription, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserSubscription $userSubscription): JsonResponse
    {
        return response()->json($userSubscription->load(['user', 'subscriptionPlan']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserSubscription $userSubscription): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'subscription_plan_id' => ['sometimes', 'required', 'integer', 'exists:subscription_plans,id'],
            'status' => ['nullable', 'string', 'max:255'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
            'renewal_at' => ['nullable', 'date'],
            'auto_renew' => ['nullable', 'boolean'],
        ]);

        $userSubscription->update($validated);

        return response()->json($userSubscription->refresh()->load(['user', 'subscriptionPlan']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserSubscription $userSubscription): JsonResponse
    {
        $userSubscription->delete();

        return response()->json(['message' => 'User subscription deleted']);
    }
}
