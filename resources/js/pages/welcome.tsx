import { ServiceIcon } from '@/components/service-icon';
import { Card } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';
import { GuestLayout } from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';

const services = [
    {
        title: 'Stockage d’images',
        description:
            'Envoyez vos JPEG, PNG ou WEBP et récupérez une URL publique utilisable immédiatement dans votre app.',
        icon: '/images/services/images.png',
    },
    {
        title: 'Stockage de PDF',
        description:
            'Vos rapports, fiches ou documents de cours peuvent aussi être hébergés et partagés par URL.',
        icon: '/images/services/pdf.png',
    },
    {
        title: 'Clé API personnelle',
        description:
            'Chaque étudiant reçoit une clé API unique pour uploader directement depuis son app (Flutter, web, mobile).',
        icon: '/images/services/api-key.png',
    },
    {
        title: 'Suivi de votre espace',
        description:
            'Un dashboard simple pour voir votre quota utilisé, vos fichiers, et en supprimer si besoin.',
        icon: '/images/services/dashboard.png',
    },
];

const steps = [
    {
        title: 'Créez votre compte',
        description: 'Inscription en quelques secondes avec votre email.',
    },
    {
        title: 'Récupérez votre clé API',
        description: 'Disponible immédiatement dans votre dashboard.',
    },
    {
        title: 'Envoyez vos fichiers',
        description:
            'Un simple appel POST avec votre clé, et vous recevez une URL publique en retour.',
    },
];

export default function Welcome() {
    return (
        <GuestLayout>
            <Head title="Stockage d’images et PDF pour étudiants" />

            <section className="mx-auto max-w-4xl px-6 pt-12 pb-20 text-center">
                <span className="inline-flex items-center rounded-full bg-lavender-soft px-4 py-1.5 text-sm font-medium text-lavender-ink">
                    Pensé pour les étudiants en développement
                </span>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                    Stockez vos images et PDF,{' '}
                    <span className="text-primary-ink">sans vous battre avec Firebase.</span>
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
                    Une API simple, pensée pour vos projets de cours. Envoyez un
                    fichier, recevez une URL publique. C’est tout.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <ButtonLink href="/register" size="lg">
                        Créer un compte gratuit
                    </ButtonLink>
                    <ButtonLink href="/login" variant="secondary" size="lg">
                        J’ai déjà un compte
                    </ButtonLink>
                </div>
                <Link
                    href="/docs"
                    className="mt-4 inline-block text-sm font-medium text-primary-ink"
                >
                    Consulter la documentation de l’API →
                </Link>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-20">
                <div className="grid gap-5 sm:grid-cols-2">
                    {services.map((service) => (
                        <Card key={service.title} className="flex flex-col gap-3">
                            <ServiceIcon src={service.icon} alt="" />
                            <h3 className="text-lg font-semibold text-ink">
                                {service.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-ink-soft">
                                {service.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 pb-24">
                <Card className="grid gap-8 p-8 sm:grid-cols-3 sm:p-10">
                    {steps.map((step, index) => (
                        <div key={step.title} className="flex flex-col gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-ink">
                                {index + 1}
                            </span>
                            <h4 className="font-semibold text-ink">{step.title}</h4>
                            <p className="text-sm text-ink-soft">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </Card>
                <p className="mt-8 text-center text-sm text-ink-soft">
                    Service pédagogique — fourni pour aider les étudiants à se
                    concentrer sur leurs projets plutôt que sur
                    l’infrastructure.
                </p>
            </section>
        </GuestLayout>
    );
}
