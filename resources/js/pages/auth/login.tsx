import { AuthIllustration } from '@/components/auth-illustration';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { GuestLayout } from '@/layouts/guest-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center gap-10 px-6 py-12">
                <AuthIllustration
                    src="/images/illustrations/login.png"
                    alt="Illustration de connexion"
                />

                <div className="w-full max-w-md">
                    <Card>
                        <h1 className="text-2xl font-semibold text-ink">
                            Bon retour
                        </h1>
                        <p className="mt-1 text-sm text-ink-soft">
                            Connectez-vous pour accéder à votre espace de
                            stockage.
                        </p>

                        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="vous@exemple.com"
                                autoComplete="email"
                                value={data.email}
                                error={errors.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <TextField
                                label="Mot de passe"
                                type="password"
                                name="password"
                                placeholder="Votre mot de passe"
                                autoComplete="current-password"
                                value={data.password}
                                error={errors.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <Button type="submit" disabled={processing} className="mt-2">
                                {processing ? 'Connexion…' : 'Se connecter'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-ink-soft">
                            Pas encore de compte ?{' '}
                            <Link href="/register" className="font-medium text-primary-ink">
                                Créer un compte
                            </Link>
                        </p>
                    </Card>
                </div>
            </div>
        </GuestLayout>
    );
}
