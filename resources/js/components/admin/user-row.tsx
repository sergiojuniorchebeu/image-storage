import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatBytes } from '@/lib/format';
import type { AdminUser } from '@/types/models';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function UserRow({ user }: { user: AdminUser }) {
    const [expanded, setExpanded] = useState(false);
    const [quota, setQuota] = useState(user.storage_quota_mb);

    const quotaBytes = user.storage_quota_mb * 1024 * 1024;
    const percent = quotaBytes > 0 ? (user.used_bytes / quotaBytes) * 100 : 0;

    const saveQuota = () => {
        router.patch(
            `/admin/users/${user.id}`,
            { storage_quota_mb: quota },
            { preserveScroll: true },
        );
    };

    const revoke = () => {
        if (!confirm(`Révoquer la clé API de ${user.name} ?`)) return;
        router.post(`/admin/users/${user.id}/revoke-token`, {}, { preserveScroll: true });
    };

    const toggleSuspend = () => {
        const question = user.is_suspended
            ? `Réactiver le compte de ${user.name} ?`
            : `Suspendre le compte de ${user.name} ? Sa clé API sera révoquée.`;
        if (!confirm(question)) return;
        router.post(`/admin/users/${user.id}/toggle-suspend`, {}, { preserveScroll: true });
    };

    const removeFile = (fileId: number) => {
        if (!confirm('Supprimer ce fichier ?')) return;
        router.delete(`/admin/files/${fileId}`, { preserveScroll: true });
    };

    return (
        <div className="border-b border-line py-4 last:border-0">
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                <div className="sm:col-span-3">
                    <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-ink">
                            {user.name}
                        </p>
                        {user.is_suspended && <Badge tone="danger">Suspendu</Badge>}
                    </div>
                    <p className="truncate text-xs text-ink-soft">{user.email}</p>
                </div>

                <div className="sm:col-span-3">
                    <ProgressBar
                        value={percent}
                        tone={percent >= 90 ? 'danger' : 'primary'}
                    />
                    <p className="mt-1 text-xs text-ink-soft">
                        {formatBytes(user.used_bytes)} / {user.storage_quota_mb} Mo ·{' '}
                        {user.files_count} fichier(s)
                    </p>
                </div>

                <div className="flex items-center gap-2 sm:col-span-2">
                    <input
                        type="number"
                        min={1}
                        value={quota}
                        onChange={(e) => setQuota(Number(e.target.value))}
                        className="h-9 w-20 rounded-field bg-surface-2 px-2 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <span className="text-xs text-ink-soft">Mo</span>
                    {quota !== user.storage_quota_mb && (
                        <Button size="sm" variant="secondary" onClick={saveQuota}>
                            OK
                        </Button>
                    )}
                </div>

                <div className="sm:col-span-2">
                    {user.has_api_token ? (
                        <Badge tone="mint">Clé active</Badge>
                    ) : (
                        <Badge tone="neutral">Sans clé</Badge>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:col-span-2 sm:justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setExpanded((v) => !v)}>
                        {expanded ? 'Masquer' : 'Fichiers'}
                    </Button>
                    {user.has_api_token && (
                        <Button size="sm" variant="secondary" onClick={revoke}>
                            Révoquer
                        </Button>
                    )}
                    {user.role !== 'admin' && (
                        <Button
                            size="sm"
                            variant={user.is_suspended ? 'secondary' : 'danger'}
                            onClick={toggleSuspend}
                        >
                            {user.is_suspended ? 'Réactiver' : 'Suspendre'}
                        </Button>
                    )}
                </div>
            </div>

            {expanded && (
                <div className="mt-4 rounded-lg bg-surface-2 p-4">
                    {user.files.length === 0 ? (
                        <p className="text-xs text-ink-soft">Aucun fichier.</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {user.files.map((file) => (
                                <li
                                    key={file.id}
                                    className="flex flex-wrap items-center justify-between gap-2 text-xs"
                                >
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="min-w-0 flex-1 truncate text-primary-ink"
                                    >
                                        {file.original_name}
                                    </a>
                                    <span className="shrink-0 text-ink-soft">
                                        {formatBytes(file.size)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(file.id)}
                                        className="shrink-0 font-medium text-danger-ink"
                                    >
                                        Supprimer
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
