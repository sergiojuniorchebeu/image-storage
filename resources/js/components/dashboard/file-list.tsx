import { Card } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { formatBytes } from '@/lib/format';
import type { StoredFile } from '@/types/models';
import { router } from '@inertiajs/react';

export function FileList({ files }: { files: StoredFile[] }) {
    const remove = (file: StoredFile) => {
        if (!confirm(`Supprimer « ${file.original_name} » ?`)) return;
        router.delete(`/dashboard/files/${file.id}`, { preserveScroll: true });
    };

    if (files.length === 0) {
        return (
            <Card className="flex flex-col items-center gap-2 py-12 text-center">
                <span className="text-2xl">🗂️</span>
                <p className="text-sm text-ink-soft">
                    Aucun fichier pour le moment.
                </p>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
                <Card key={file.id} className="flex flex-col gap-3 p-4">
                    <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-surface-2">
                        {file.type === 'image' ? (
                            <img
                                src={file.url}
                                alt={file.original_name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl">📄</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                            {file.original_name}
                        </p>
                        <p className="text-xs text-ink-soft">
                            {formatBytes(file.size)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <CopyButton value={file.url} label="Copier l’URL" />
                        <button
                            type="button"
                            onClick={() => remove(file)}
                            className="ml-auto rounded-lg px-3 py-1.5 text-xs font-medium text-danger-ink hover:bg-danger-soft"
                        >
                            Supprimer
                        </button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
