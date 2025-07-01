<?php

namespace App\Models\Mails;

use Illuminate\Database\Eloquent\Model;

class MailLogAttachment extends Model {
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];
}
