<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizQuestion extends Model
{
    protected $fillable = ['quiz_id', 'question', 'options', 'correct'];

    protected $casts = ['options' => 'array'];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }
}