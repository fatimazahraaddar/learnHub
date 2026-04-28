<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Enrollment;

class AnalyticsController extends Controller
{
    public function trainer(Request $request)
    {
        $trainer = $request->user();

        $courses = Course::where('trainer_id', $trainer->id)->get(); // ✅ trainer_id

        $courseIds = $courses->pluck('id');

        $totalEnrollments = Enrollment::whereIn('course_id', $courseIds)->count();

        $avgRating = round($courses->avg('rating') ?? 0, 1);

        return response()->json([
            'total_enrollments' => $totalEnrollments,
            'avg_rating'        => $avgRating,
            'total_courses'     => $courses->count(),
        ]);
    }
}