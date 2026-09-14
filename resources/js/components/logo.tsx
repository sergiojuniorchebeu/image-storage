import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary-ink">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    />
                    <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
                    <path
                        d="M5 16.5L9 12.5L12.5 16L16 12.5L19 15.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span className="text-[15px] font-semibold text-ink">
                StockImg
            </span>
        </div>
    );
}
