<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;

class RbacPermission extends Model {
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];
}
