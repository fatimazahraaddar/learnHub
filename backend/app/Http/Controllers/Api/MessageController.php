<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
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
        $query = Message::with(['sender', 'receiver'])->latest();
        $userId = (int) $request->user()->id;

        if ($request->filled('sender_id')) {
            $senderId = $request->integer('sender_id');
            if (! $this->isPrivileged($request) && $senderId !== $userId) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }

            $query->where('sender_id', $senderId);
        }

        if ($request->filled('receiver_id')) {
            $receiverId = $request->integer('receiver_id');
            if (! $this->isPrivileged($request) && $receiverId !== $userId) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }

            $query->where('receiver_id', $receiverId);
        }

        if (! $this->isPrivileged($request) && ! $request->filled('sender_id') && ! $request->filled('receiver_id')) {
            $query->where(function ($q) use ($userId): void {
                $q->where('sender_id', $userId)->orWhere('receiver_id', $userId);
            });
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sender_id' => ['required', 'integer', 'exists:users,id'],
            'receiver_id' => ['required', 'integer', 'exists:users,id'],
            'subject' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'read_at' => ['nullable', 'date'],
        ]);

        if (! $this->isPrivileged($request) && (int) $validated['sender_id'] !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $message = Message::create($validated)->load(['sender', 'receiver']);

        return response()->json($message, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Message $message): JsonResponse
    {
        if (! $this->isPrivileged($request)) {
            $userId = (int) $request->user()->id;
            if ((int) $message->sender_id !== $userId && (int) $message->receiver_id !== $userId) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }
        }

        return response()->json($message->load(['sender', 'receiver']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message): JsonResponse
    {
        if (! $this->isPrivileged($request)) {
            $userId = (int) $request->user()->id;
            if ((int) $message->sender_id !== $userId && (int) $message->receiver_id !== $userId) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }
        }

        $validated = $request->validate([
            'sender_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'receiver_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'subject' => ['nullable', 'string', 'max:255'],
            'body' => ['sometimes', 'required', 'string'],
            'read_at' => ['nullable', 'date'],
        ]);

        if (! $this->isPrivileged($request) && array_key_exists('sender_id', $validated) && (int) $validated['sender_id'] !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $message->update($validated);

        return response()->json($message->refresh()->load(['sender', 'receiver']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Message $message): JsonResponse
    {
        if (! $this->isPrivileged($request)) {
            $userId = (int) $request->user()->id;
            if ((int) $message->sender_id !== $userId && (int) $message->receiver_id !== $userId) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }
        }

        $message->delete();

        return response()->json(['message' => 'Message deleted']);
    }
}
