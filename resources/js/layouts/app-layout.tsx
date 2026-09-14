import { FlashToast } from '@/components/flash-toast';
import { Footer } from '@/components/footer';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
    const { props: { auth }, url } = usePage();
    const user = auth.user!;

    const navItems = user.role === 'admin'
        ? [
              { href: '/admin', label: 'Étudiants' },
              { href: '/docs', label: 'Documentation' },
          ]
        : [
              { href: '/dashboard', label: 'Mes fichiers' },
              { href: '/docs', label: 'Documentation' },
          ];

    return (
        <div className="flex min-h-screen flex-col bg-bg">
            <FlashToast />
            <header className="border-b border-line bg-surface/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <Link href="/">
                            <Logo />
                        </Link>
                        <nav className="hidden items-center gap-1 sm:flex">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-2',
                                        url.startsWith(item.href) && 'bg-primary-soft text-primary-ink',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium text-ink">{user.name}</p>
                            <p className="text-xs text-ink-soft">{user.email}</p>
                        </div>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender-soft text-sm font-semibold text-lavender-ink">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.post('/logout')}
                        >
                            Déconnexion
                        </Button>
                    </div>
                </div>
                <nav className="flex gap-2 overflow-x-auto px-6 pb-3 sm:hidden">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'shrink-0 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink-soft',
                                url.startsWith(item.href) && 'bg-primary-soft text-primary-ink',
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </header>
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
