import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    hint?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    function TextField({ label, error, hint, className, id, ...props }, ref) {
        const inputId = id ?? props.name;

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="px-1 text-sm font-medium text-ink"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'h-12 w-full rounded-field bg-surface-2 px-4 text-[15px] text-ink placeholder:text-ink-soft/70',
                        'outline-none transition-shadow duration-150 focus:ring-2 focus:ring-primary/40',
                        error && 'ring-2 ring-danger/50',
                        className,
                    )}
                    {...props}
                />
                {hint && !error && (
                    <p className="px-1 text-xs text-ink-soft">{hint}</p>
                )}
                {error && (
                    <p className="px-1 text-xs text-danger-ink">{error}</p>
                )}
            </div>
        );
    },
);
