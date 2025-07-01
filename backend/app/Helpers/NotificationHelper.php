<?php

namespace App\Helpers;

use App\Models\Notification;

class NotificationHelper {
    /**
     * Check if the given user has the specified permission.
     */
    public static function createNotification($user, $content) {
        // add user_id to content
        $content['user_id'] = $user->id;

        Notification::create($content);
    }
}
