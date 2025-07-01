<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;

class UserLog extends Model {
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];
}
