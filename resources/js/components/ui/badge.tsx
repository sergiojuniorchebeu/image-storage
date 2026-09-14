import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

const tones = {
    primary: 'bg-primary-soft text-primary-ink',
    mint: 'bg-mint-soft text-mint-ink',
    peach: 'bg-peach-soft text-peach-ink',
    blush: 'bg-blush-soft text-blush-ink',
    lavender: 'bg-lavender-soft text-lavender-ink',
    danger: 'bg-danger-soft text-danger-ink',
    neutral: 'bg-surface-2 text-ink-soft',
};

export function Badge({
    className,
    tone = 'neutral',
    ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                tones[tone],
                className,
            )}
            {...props}
        />
    );
}
