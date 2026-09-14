<?php

namespace App\Http\Controllers;

use App\Exceptions\FileUploadException;
use App\Http\Requests\StoreFileRequest;
use App\Models\File;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FileController extends Controller
{
    public function __construct(
        private readonly FileUploadService $uploadService,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'files' => $user->files()->latest()->get(),
            'usedBytes' => $user->usedStorageBytes(),
            'quotaBytes' => $user->quotaBytes(),
            'hasApiToken' => $user->tokens()->exists(),
        ]);
    }

    public function store(StoreFileRequest $request): RedirectResponse
    {
        try {
            $this->uploadService->store($request->user(), $request->file('file'));
        } catch (FileUploadException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Fichier envoyé avec succès.');
    }

    public function destroy(Request $request, File $file): RedirectResponse
    {
        Gate::authorize('delete', $file);

        $this->uploadService->delete($file);

        return back()->with('success', 'Fichier supprimé.');
    }
}
