<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function image(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:5120'],
        ]);

        $storedPath = $validated['image']->store('uploads/images', 'public');
        $publicUrl = $request->getSchemeAndHttpHost().'/storage/'.$storedPath;

        return response()->json([
            'message' => 'Image uploaded successfully',
            'path' => $storedPath,
            'url' => $publicUrl,
        ], 201);
    }
}

