<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'period',
        'color',
        'is_popular',
        'is_active',
        'features',
        'disabled_features',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'features' => 'array',
            'disabled_features' => 'array',
        ];
    }

    public function userSubscriptions(): HasMany
    {
        return $this->hasMany(UserSubscription::class);
    }
}
