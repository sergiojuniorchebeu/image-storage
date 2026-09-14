import { AuthIllustration } from '@/components/auth-illustration';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { GuestLayout } from '@/layouts/guest-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout>
            <Head title="Créer un compte" />

            <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center gap-10 px-6 py-12">
                <AuthIllustration
                    src="/images/illustrations/register.png"
                    alt="Illustration d’inscription"
                />

                <div className="w-full max-w-md">
                    <Card>
                        <h1 className="text-2xl font-semibold text-ink">
                            Créer un compte
                        </h1>
                        <p className="mt-1 text-sm text-ink-soft">
                            15 Mo offerts pour stocker vos images et PDF.
                        </p>

                        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
                            <TextField
                                label="Nom complet"
                                name="name"
                                placeholder="Jean Dupont"
                                autoComplete="name"
                                value={data.name}
                                error={errors.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
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
                                placeholder="8 caractères minimum"
                                autoComplete="new-password"
                                value={data.password}
                                error={errors.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <TextField
                                label="Confirmer le mot de passe"
                                type="password"
                                name="password_confirmation"
                                placeholder="Répétez le mot de passe"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                error={errors.password_confirmation}
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                            />
                            <Button type="submit" disabled={processing} className="mt-2">
                                {processing ? 'Création…' : 'Créer mon compte'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-ink-soft">
                            Déjà un compte ?{' '}
                            <Link href="/login" className="font-medium text-primary-ink">
                                Se connecter
                            </Link>
                        </p>
                    </Card>
                </div>
            </div>
        </GuestLayout>
    );
}
