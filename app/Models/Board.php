<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug'])]
class Board extends Model
{
    /**
     * @return HasMany<KanbanColumn, $this>
     */
    public function columns(): HasMany
    {
        return $this->hasMany(KanbanColumn::class);
    }
}
