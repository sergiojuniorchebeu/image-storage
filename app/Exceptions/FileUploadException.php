<?php

namespace App\Exceptions;

use RuntimeException;

class FileUploadException extends RuntimeException
{
    public static function quotaExceeded(int $remainingBytes): self
    {
        $remainingMb = round($remainingBytes / 1024 / 1024, 2);

        return new self("Quota de stockage dépassé. Il vous reste {$remainingMb} Mo disponibles.");
    }

    public static function unsupportedType(string $mimeType): self
    {
        return new self("Type de fichier non autorisé : {$mimeType}. Formats acceptés : JPEG, PNG, WEBP, PDF.");
    }

    public static function fileTooLarge(string $type, int $maxKb): self
    {
        $maxMb = round($maxKb / 1024, 1);

        return new self("Fichier trop volumineux pour le type \"{$type}\". Taille maximale : {$maxMb} Mo.");
    }
}
