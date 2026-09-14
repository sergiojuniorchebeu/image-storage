import { cn } from '@/lib/utils';
import { useState } from 'react';

/**
 * Bare slot for a small transparent icon (PNG/SVG) dropped into
 * `public/images/services/`. No background/frame — the icon is meant to
 * float directly on the card, so it stays invisible until the image is
 * actually added.
 */
export function ServiceIcon({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    const [loaded, setLoaded] = useState(true);

    if (!loaded) return null;

    return (
        <img
            src={src}
            alt={alt}
            className={cn('h-11 w-11 object-contain', className)}
            onError={() => setLoaded(false)}
        />
    );
}
