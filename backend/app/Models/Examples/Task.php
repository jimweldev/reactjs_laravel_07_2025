<?php

namespace App\Models\Examples;

use Illuminate\Database\Eloquent\Model;

class Task extends Model {
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];
}
