import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatBytes } from '@/lib/format';

export function QuotaCard({
    usedBytes,
    quotaBytes,
}: {
    usedBytes: number;
    quotaBytes: number;
}) {
    const percent = quotaBytes > 0 ? (usedBytes / quotaBytes) * 100 : 0;
    const tone = percent >= 90 ? 'danger' : percent >= 70 ? 'peach' : 'primary';

    return (
        <Card>
            <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-ink">Espace utilisé</h3>
                <span className="text-sm text-ink-soft">
                    {formatBytes(usedBytes)} / {formatBytes(quotaBytes)}
                </span>
            </div>
            <ProgressBar value={percent} tone={tone} className="mt-4" />
            {percent >= 90 && (
                <p className="mt-3 text-xs text-danger-ink">
                    Vous approchez de votre limite de stockage.
                </p>
            )}
        </Card>
    );
}
