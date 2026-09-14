import { Footer } from '@/components/footer';
import { Logo } from '@/components/logo';
import { ButtonLink } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export function GuestLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col bg-bg">
            <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6">
                <Link href="/">
                    <Logo />
                </Link>
                <nav className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                        href="/docs"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-2"
                    >
                        Docs
                    </Link>
                    {auth.user ? (
                        <ButtonLink
                            href={auth.user.role === 'admin' ? '/admin' : '/dashboard'}
                            size="sm"
                        >
                            Mon espace
                        </ButtonLink>
                    ) : (
                        <>
                            <ButtonLink href="/login" variant="ghost" size="sm">
                                Connexion
                            </ButtonLink>
                            <ButtonLink href="/register" size="sm">
                                Créer un compte
                            </ButtonLink>
                        </>
                    )}
                </nav>
            </header>
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
