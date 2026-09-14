import { cn } from '@/lib/utils';
import { Link, type InertiaLinkProps } from '@inertiajs/react';
import type { ButtonHTMLAttributes } from 'react';

const variants = {
    primary:
        'bg-primary text-white shadow-soft hover:bg-primary-strong active:scale-[0.98]',
    secondary:
        'bg-surface-2 text-ink shadow-soft hover:bg-line active:scale-[0.98]',
    ghost: 'bg-transparent text-ink-soft hover:bg-surface-2 active:scale-[0.98]',
    danger: 'bg-danger-soft text-danger-ink hover:bg-danger/20 active:scale-[0.98]',
};

const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> & {
    variant?: Variant;
    size?: Size;
}) {
    return (
        <button
            className={cn(base, variants[variant], sizes[size], className)}
            {...props}
        />
    );
}

export function ButtonLink({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: Omit<InertiaLinkProps, 'size'> & { variant?: Variant; size?: Size }) {
    return (
        <Link
            className={cn(base, variants[variant], sizes[size], className)}
            {...props}
        />
    );
}
