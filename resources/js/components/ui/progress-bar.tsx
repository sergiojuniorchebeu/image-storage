import { cn } from '@/lib/utils';

export function ProgressBar({
    value,
    tone = 'primary',
    className,
}: {
    value: number;
    tone?: 'primary' | 'mint' | 'peach' | 'blush' | 'danger';
    className?: string;
}) {
    const fillTone = {
        primary: 'bg-primary',
        mint: 'bg-mint',
        peach: 'bg-peach',
        blush: 'bg-blush',
        danger: 'bg-danger',
    }[tone];

    const clamped = Math.min(100, Math.max(0, value));

    return (
        <div
            className={cn(
                'h-2.5 w-full overflow-hidden rounded-full bg-surface-2',
                className,
            )}
            role="progressbar"
            aria-valuenow={Math.round(clamped)}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <div
                className={cn('h-full rounded-full transition-all duration-300', fillTone)}
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
}
