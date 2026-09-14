<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;

class FileController extends Controller
{
    public function __construct(
        private readonly FileUploadService $uploadService,
    ) {}

    public function destroy(File $file): RedirectResponse
    {
        $this->uploadService->delete($file);

        return back()->with('success', 'Fichier supprimé.');
    }
}
