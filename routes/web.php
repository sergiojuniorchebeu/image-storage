<?php

use App\Http\Controllers\Admin\FileController as AdminFileController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\ApiTokenController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/docs', 'docs')->name('docs');

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware(['auth', 'active'])->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('dashboard', [FileController::class, 'index'])->name('dashboard');
    Route::post('dashboard/files', [FileController::class, 'store'])->name('files.store');
    Route::delete('dashboard/files/{file}', [FileController::class, 'destroy'])->name('files.destroy');
    Route::post('dashboard/token', [ApiTokenController::class, 'store'])->name('token.store');

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminUserController::class, 'index'])->name('index');
        Route::patch('users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::post('users/{user}/revoke-token', [AdminUserController::class, 'revokeToken'])->name('users.revoke-token');
        Route::post('users/{user}/toggle-suspend', [AdminUserController::class, 'toggleSuspend'])->name('users.toggle-suspend');
        Route::delete('files/{file}', [AdminFileController::class, 'destroy'])->name('files.destroy');
    });
});
