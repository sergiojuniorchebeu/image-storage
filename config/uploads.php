<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Storage quota
    |--------------------------------------------------------------------------
    |
    | Default storage quota given to a newly registered student, in
    | megabytes. Admins can override this per user from the dashboard.
    |
    */
    'default_quota_mb' => (int) env('UPLOADS_DEFAULT_QUOTA_MB', 15),

    /*
    |--------------------------------------------------------------------------
    | Per-file size limits (in kilobytes)
    |--------------------------------------------------------------------------
    */
    'max_image_kb' => (int) env('UPLOADS_MAX_IMAGE_KB', 5120), // 5 MB
    'max_pdf_kb' => (int) env('UPLOADS_MAX_PDF_KB', 10240), // 10 MB

    /*
    |--------------------------------------------------------------------------
    | Allowed mime types
    |--------------------------------------------------------------------------
    |
    | Maps an accepted mime type to the logical file "type" it is stored
    | under (image or pdf). Used for validation and quota bucketing.
    |
    */
    'allowed_mimes' => [
        'image/jpeg' => 'image',
        'image/png' => 'image',
        'image/webp' => 'image',
        'application/pdf' => 'pdf',
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate limiting
    |--------------------------------------------------------------------------
    */
    'upload_rate_limit' => (int) env('UPLOADS_RATE_LIMIT_PER_MINUTE', 30),

    /*
    |--------------------------------------------------------------------------
    | Disk
    |--------------------------------------------------------------------------
    |
    | The filesystem disk uploaded files are stored on. Must be a disk
    | configured in config/filesystems.php with a public URL (e.g.
    | "public" for local storage, or an S3-compatible disk for
    | production).
    |
    */
    'disk' => env('UPLOADS_DISK', 'public'),

];
