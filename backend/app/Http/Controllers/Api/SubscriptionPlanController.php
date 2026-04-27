<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubscriptionPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(SubscriptionPlan::query()->latest()->paginate(15));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:subscription_plans,slug'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'period' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:20'],
            'is_popular' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'features' => ['nullable', 'array'],
            'disabled_features' => ['nullable', 'array'],
        ]);

        $plan = SubscriptionPlan::create($validated);

        return response()->json($plan, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SubscriptionPlan $subscriptionPlan): JsonResponse
    {
        return response()->json($subscriptionPlan);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SubscriptionPlan $subscriptionPlan): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('subscription_plans', 'slug')->ignore($subscriptionPlan->id)],
            'price' => ['nullable', 'numeric', 'min:0'],
            'period' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:20'],
            'is_popular' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'features' => ['nullable', 'array'],
            'disabled_features' => ['nullable', 'array'],
        ]);

        $subscriptionPlan->update($validated);

        return response()->json($subscriptionPlan->refresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SubscriptionPlan $subscriptionPlan): JsonResponse
    {
        $subscriptionPlan->delete();

        return response()->json(['message' => 'Subscription plan deleted']);
    }
}
