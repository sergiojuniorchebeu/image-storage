import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function CopyButton({ value, label = 'Copier' }: { value: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard API unavailable — nothing we can do silently.
        }
    };

    return (
        <Button type="button" variant="secondary" size="sm" onClick={copy}>
            {copied ? 'Copié ✓' : label}
        </Button>
    );
}
