import { useState } from 'react';

/**
 * Placeholder slot for a transparent illustration (PNG/SVG) to be dropped
 * into `public/images/illustrations/`. No frame or background — the image
 * is meant to float on the page — so it stays invisible until the file is
 * actually added.
 */
export function AuthIllustration({ src, alt }: { src: string; alt: string }) {
    const [loaded, setLoaded] = useState(true);

    if (!loaded) return null;

    return (
        <div className="hidden flex-1 items-center justify-center lg:flex">
            <img
                src={src}
                alt={alt}
                className="max-h-96 w-full object-contain"
                onError={() => setLoaded(false)}
            />
        </div>
    );
}
