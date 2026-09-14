import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function FlashToast() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    const message = flash?.success ?? flash?.error;
    const isError = !flash?.success && !!flash?.error;

    useEffect(() => {
        if (!message) return;

        setVisible(true);
        const timeout = setTimeout(() => setVisible(false), 4000);

        return () => clearTimeout(timeout);
    }, [message]);

    if (!message || !visible) return null;

    return (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
            <div
                className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-soft-lg',
                    isError
                        ? 'bg-danger-soft text-danger-ink'
                        : 'bg-mint-soft text-mint-ink',
                )}
            >
                {message}
            </div>
        </div>
    );
}
