<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserQuotaRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->with(['files' => fn ($query) => $query->latest()])
            ->withCount('files')
            ->withSum('files', 'size')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'storage_quota_mb' => $user->storage_quota_mb,
                'is_suspended' => $user->is_suspended,
                'files_count' => $user->files_count,
                'used_bytes' => (int) ($user->files_sum_size ?? 0),
                'has_api_token' => $user->tokens()->exists(),
                'created_at' => $user->created_at,
                'files' => $user->files,
            ]);

        return Inertia::render('admin/index', [
            'users' => $users,
            'totals' => [
                'users' => $users->count(),
                'files' => $users->sum('files_count'),
                'used_bytes' => $users->sum('used_bytes'),
            ],
        ]);
    }

    public function update(UpdateUserQuotaRequest $request, User $user): RedirectResponse
    {
        $user->update([
            'storage_quota_mb' => $request->integer('storage_quota_mb'),
        ]);

        return back()->with('success', "Quota mis à jour pour {$user->name}.");
    }

    public function revokeToken(User $user): RedirectResponse
    {
        $user->tokens()->delete();

        return back()->with('success', "Clé API révoquée pour {$user->name}.");
    }

    public function toggleSuspend(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            return back()->with('error', 'Vous ne pouvez pas suspendre votre propre compte.');
        }

        $user->update(['is_suspended' => ! $user->is_suspended]);

        if ($user->is_suspended) {
            $user->tokens()->delete();

            return back()->with('success', "{$user->name} a été suspendu.");
        }

        return back()->with('success', "{$user->name} a été réactivé.");
    }
}
