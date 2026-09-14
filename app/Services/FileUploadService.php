<?php

namespace App\Services;

use App\Exceptions\FileUploadException;
use App\Models\File;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class FileUploadService
{
    public function store(User $user, UploadedFile $uploadedFile): File
    {
        $mimeType = $uploadedFile->getMimeType() ?? $uploadedFile->getClientMimeType();
        $type = config("uploads.allowed_mimes.{$mimeType}");

        if ($type === null) {
            throw FileUploadException::unsupportedType($mimeType);
        }

        $maxKb = (int) config("uploads.max_{$type}_kb");
        $sizeBytes = $uploadedFile->getSize() ?: 0;

        if ($sizeBytes > $maxKb * 1024) {
            throw FileUploadException::fileTooLarge($type, $maxKb);
        }

        if ($sizeBytes > $user->remainingBytes()) {
            throw FileUploadException::quotaExceeded($user->remainingBytes());
        }

        $disk = config('uploads.disk');
        $filename = Str::uuid()->toString().'.'.$uploadedFile->getClientOriginalExtension();
        $path = $uploadedFile->storeAs("uploads/{$user->id}", $filename, $disk);

        return $user->files()->create([
            'original_name' => $uploadedFile->getClientOriginalName(),
            'path' => $path,
            'disk' => $disk,
            'mime_type' => $mimeType,
            'type' => $type,
            'size' => $sizeBytes,
        ]);
    }

    public function delete(File $file): void
    {
        $file->delete();
    }
}
