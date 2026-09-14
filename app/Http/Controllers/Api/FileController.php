<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\FileUploadException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFileRequest;
use App\Models\File;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FileController extends Controller
{
    public function __construct(
        private readonly FileUploadService $uploadService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->files()->latest()->get(),
        ]);
    }

    public function store(StoreFileRequest $request): JsonResponse
    {
        try {
            $file = $this->uploadService->store($request->user(), $request->file('file'));
        } catch (FileUploadException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['data' => $file], 201);
    }

    public function destroy(Request $request, File $file): JsonResponse
    {
        Gate::authorize('delete', $file);

        $this->uploadService->delete($file);

        return response()->json(status: 204);
    }
}
