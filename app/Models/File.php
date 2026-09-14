<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property int $user_id
 * @property string $original_name
 * @property string $path
 * @property string $disk
 * @property string $mime_type
 * @property string $type
 * @property int $size
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read string $url
 */
#[Fillable(['original_name', 'path', 'disk', 'mime_type', 'type', 'size'])]
class File extends Model
{
    /**
     * @var list<string>
     */
    protected $appends = ['url'];

    protected static function booted(): void
    {
        static::creating(function (File $file): void {
            $file->uuid ??= (string) Str::uuid();
        });

        static::deleting(function (File $file): void {
            Storage::disk($file->disk)->delete($file->path);
        });
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return Attribute<string, never>
     */
    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn () => Storage::disk($this->disk)->url($this->path),
        );
    }
}
