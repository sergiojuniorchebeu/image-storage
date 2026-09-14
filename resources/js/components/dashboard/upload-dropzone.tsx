import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useRef, useState, type DragEvent } from 'react';

const ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf';

export function UploadDropzone() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const uploadFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);

        for (const file of Array.from(files)) {
            await new Promise<void>((resolve) => {
                router.post(
                    '/dashboard/files',
                    { file },
                    {
                        forceFormData: true,
                        preserveScroll: true,
                        onFinish: () => resolve(),
                    },
                );
            });
        }

        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        void uploadFiles(e.dataTransfer.files);
    };

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-surface-2 px-6 py-10 text-center transition-colors',
                dragging && 'bg-primary-soft',
            )}
        >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-2xl">
                📤
            </span>
            <p className="text-sm font-medium text-ink">
                {uploading
                    ? 'Envoi en cours…'
                    : 'Glissez vos fichiers ici ou cliquez pour parcourir'}
            </p>
            <p className="text-xs text-ink-soft">
                JPEG, PNG, WEBP jusqu’à 5 Mo · PDF jusqu’à 10 Mo
            </p>
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                multiple
                className="hidden"
                onChange={(e) => void uploadFiles(e.target.files)}
            />
        </div>
    );
}
