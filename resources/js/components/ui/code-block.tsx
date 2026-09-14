import { cn } from '@/lib/utils';
import { useState } from 'react';

export function CodeBlock({
    code,
    label,
    className,
}: {
    code: string;
    label?: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard API unavailable — nothing we can do silently.
        }
    };

    return (
        <div className={cn('overflow-hidden rounded-lg bg-ink', className)}>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                <span className="text-xs font-medium text-white/50">
                    {label}
                </span>
                <button
                    type="button"
                    onClick={copy}
                    className="rounded-md px-2 py-1 text-xs font-medium text-white/70 hover:bg-white/10"
                >
                    {copied ? 'Copié ✓' : 'Copier'}
                </button>
            </div>
            <pre className="overflow-x-auto px-4 py-3 text-xs leading-relaxed text-mint-soft">
                {code}
            </pre>
        </div>
    );
}
