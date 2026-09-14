import { UserRow } from '@/components/admin/user-row';
import { Card } from '@/components/ui/card';
import { AppLayout } from '@/layouts/app-layout';
import { formatBytes } from '@/lib/format';
import type { AdminUser } from '@/types/models';
import { Head } from '@inertiajs/react';

export default function AdminIndex({
    users,
    totals,
}: {
    users: AdminUser[];
    totals: { users: number; files: number; used_bytes: number };
}) {
    return (
        <AppLayout>
            <Head title="Administration" />

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <p className="text-xs font-medium text-ink-soft uppercase">Étudiants</p>
                    <p className="mt-1 text-2xl font-semibold text-ink">{totals.users}</p>
                </Card>
                <Card>
                    <p className="text-xs font-medium text-ink-soft uppercase">Fichiers</p>
                    <p className="mt-1 text-2xl font-semibold text-ink">{totals.files}</p>
                </Card>
                <Card>
                    <p className="text-xs font-medium text-ink-soft uppercase">Stockage utilisé</p>
                    <p className="mt-1 text-2xl font-semibold text-ink">
                        {formatBytes(totals.used_bytes)}
                    </p>
                </Card>
            </div>

            <Card className="mt-6 p-6">
                <h2 className="mb-2 text-sm font-semibold text-ink-soft uppercase tracking-wide">
                    Étudiants
                </h2>
                <div>
                    {users.map((user) => (
                        <UserRow key={user.id} user={user} />
                    ))}
                </div>
            </Card>
        </AppLayout>
    );
}
