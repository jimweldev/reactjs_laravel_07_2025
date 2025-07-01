<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Core\AuthController;
use App\Http\Controllers\Core\RbacPermissionController;
use App\Http\Controllers\Core\RbacRoleController;
use App\Http\Controllers\Core\UserController;
use App\Http\Controllers\Examples\TaskController;
use App\Http\Controllers\Mails\MailLogController;
use App\Http\Controllers\Mails\MailTemplateController;
use App\Http\Controllers\Selects\SelectController;
use App\Http\Controllers\System\SystemGlobalDropdownController;
use App\Http\Controllers\System\SystemSettingController;
use App\Http\Controllers\User\UserImageController;
use Illuminate\Support\Facades\Route;

Route::get('', function () {
    return response()->json(['message' => 'Hello World!']);
});

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/refresh-token', [AuthController::class, 'refreshToken']);

Route::middleware('auth.middleware')->group(function () {
    // ===================================================================
    // ===================================================================
    // === CORE
    // ===================================================================
    // ===================================================================

    // ==============
    // === USERS
    Route::get('/users/paginate', [UserController::class, 'paginate']);
    Route::post('/users/import', [UserController::class, 'import']);
    Route::resource('/users', UserController::class);

    // user roles
    Route::get('/users/{id}/user-roles', [UserController::class, 'getUserRoles']);
    Route::patch('/users/{id}/user-roles', [UserController::class, 'updateUserRoles']);

    // archived users
    Route::get('/users/{id}/archived', [UserController::class, 'getArchivedUser']);
    Route::post('/users/{id}/archived/restore', [UserController::class, 'restoreArchivedUser']);
    Route::get('/users/archived/paginate', [UserController::class, 'getAllArchivedUsersPaginate']);

    // ==============
    // === RBAC
    // roles
    Route::get('/rbac/roles/paginate', [RbacRoleController::class, 'paginate']);
    Route::get('/rbac/roles/{id}/permissions/{permissionId}', [RbacRoleController::class, 'getPermission']);
    Route::post('/rbac/roles/{id}/permissions', [RbacRoleController::class, 'addPermission']);
    Route::delete('/rbac/roles/{id}/permissions/{permissionId}', [RbacRoleController::class, 'removePermission']);
    Route::resource('/rbac/roles', RbacRoleController::class);

    // permissions
    Route::get('/rbac/permissions/paginate', [RbacPermissionController::class, 'paginate']);
    Route::resource('/rbac/permissions', RbacPermissionController::class);

    // ==============
    // === SETTINGS
    // general
    Route::patch('/settings', [UserController::class, 'updateUserSettings']);
    Route::patch('/settings/profile', [UserController::class, 'updateProfile']);
    Route::post('/settings/profile/avatar', [UserController::class, 'updateProfileAvatar']);
    Route::patch('/settings/change-password', [UserController::class, 'changePassword']);

    // user images
    Route::get('/user-images/paginate', [UserImageController::class, 'paginate']);
    Route::resource('/user-images', UserImageController::class);

    // ===================================================================
    // ===================================================================
    // === ADMIN
    // ===================================================================
    // ===================================================================

    // ==============
    // === DASHBOARD
    Route::get('/dashboard/statistics', [DashboardController::class, 'getDashboardStatistics']);
    Route::get('/dashboard/user-registration-stats', [DashboardController::class, 'getUserRegistrationStats']);
    Route::get('/dashboard/account-types', [DashboardController::class, 'getDashboardAccountTypes']);

    // ==============
    // === SYSTEM
    // system settings
    Route::get('/system/settings/paginate', [SystemSettingController::class, 'paginate']);
    Route::resource('/system/settings', SystemSettingController::class);

    // global dropdowns
    Route::get('/system/global-dropdowns/paginate', [SystemGlobalDropdownController::class, 'paginate']);
    Route::resource('/system/global-dropdowns', SystemGlobalDropdownController::class);

    // ==============
    // === MAILS
    // mail templates
    Route::get('/mails/templates/paginate', [MailTemplateController::class, 'paginate']);
    Route::resource('/mails/templates', MailTemplateController::class);

    // mail logs
    Route::get('/mails/logs/paginate', [MailLogController::class, 'paginate']);
    Route::resource('/mails/logs', MailLogController::class);

    // ===================================================================
    // ===================================================================
    // === SELECTS
    // ===================================================================
    // ===================================================================
    // === SELECT
    Route::get('/select/roles', [SelectController::class, 'getSelectRoles']);
    Route::get('/select/permissions', [SelectController::class, 'getSelectPermissions']);
    Route::get('/select/users', [SelectController::class, 'getSelectUsers']);
    Route::get('/select/global-dropdowns', [SelectController::class, 'getSelectSystemGlobalDropdowns']);

    Route::get('/system/global-dropdowns/paginate', [SystemGlobalDropdownController::class, 'paginate']);
    Route::resource('/system/global-dropdowns', SystemGlobalDropdownController::class);

    // ===================================================================
    // ===================================================================
    // === EXAMPLES
    // ===================================================================
    // ===================================================================

    // ==============
    // === TASKs
    Route::get('/tasks/paginate', [TaskController::class, 'paginate']);
    Route::resource('/tasks', TaskController::class);
});
