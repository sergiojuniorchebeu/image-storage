import { ApiKeyCard } from '@/components/dashboard/api-key-card';
import { FileList } from '@/components/dashboard/file-list';
import { QuotaCard } from '@/components/dashboard/quota-card';
import { UploadDropzone } from '@/components/dashboard/upload-dropzone';
import { AppLayout } from '@/layouts/app-layout';
import type { StoredFile } from '@/types/models';
import { Head } from '@inertiajs/react';

export default function Dashboard({
    files,
    usedBytes,
    quotaBytes,
    hasApiToken,
}: {
    files: StoredFile[];
    usedBytes: number;
    quotaBytes: number;
    hasApiToken: boolean;
}) {
    return (
        <AppLayout>
            <Head title="Mes fichiers" />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <UploadDropzone />

                    <div className="mt-6">
                        <h2 className="mb-3 text-sm font-semibold text-ink-soft uppercase tracking-wide">
                            Mes fichiers ({files.length})
                        </h2>
                        <FileList files={files} />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <QuotaCard usedBytes={usedBytes} quotaBytes={quotaBytes} />
                    <ApiKeyCard hasApiToken={hasApiToken} />
                </div>
            </div>
        </AppLayout>
    );
}
