import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { CopyButton } from '@/components/ui/copy-button';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export function ApiKeyCard({ hasApiToken }: { hasApiToken: boolean }) {
    const { flash } = usePage().props;
    const [showSnippet, setShowSnippet] = useState(false);
    const apiUrl = `${window.location.origin}/api/v1/files`;

    const generate = () => {
        router.post('/dashboard/token', {}, { preserveScroll: true });
    };

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ink">Clé API</h3>
                {hasApiToken && <Badge tone="mint">Active</Badge>}
            </div>

            {flash?.api_token ? (
                <div className="mt-4 flex flex-col gap-3">
                    <p className="text-xs text-peach-ink">
                        Copiez-la maintenant : elle ne sera plus jamais affichée.
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 truncate rounded-lg bg-surface-2 px-3 py-2 text-xs text-ink">
                            {flash.api_token}
                        </code>
                        <CopyButton value={flash.api_token} />
                    </div>
                </div>
            ) : hasApiToken ? (
                <div className="mt-4 flex flex-col gap-3">
                    <p className="text-sm text-ink-soft">
                        Votre clé est active mais ne peut être réaffichée. En cas
                        de perte, régénérez-la (l’ancienne cessera de
                        fonctionner).
                    </p>
                    <Button variant="secondary" size="sm" onClick={generate}>
                        Régénérer ma clé
                    </Button>
                </div>
            ) : (
                <div className="mt-4 flex flex-col gap-3">
                    <p className="text-sm text-ink-soft">
                        Générez une clé pour uploader vos fichiers directement
                        depuis votre application.
                    </p>
                    <Button size="sm" onClick={generate} className="self-start">
                        Générer ma clé API
                    </Button>
                </div>
            )}

            <div className="mt-4 flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => setShowSnippet((v) => !v)}
                    className="text-xs font-medium text-primary-ink"
                >
                    {showSnippet ? 'Masquer' : 'Voir'} un exemple d’utilisation
                </button>
                <Link href="/docs" className="text-xs font-medium text-ink-soft">
                    Documentation complète →
                </Link>
            </div>

            {showSnippet && (
                <CodeBlock
                    className="mt-3"
                    label="curl"
                    code={`curl -X POST ${apiUrl} \\
  -H "Authorization: Bearer VOTRE_CLE" \\
  -F "file=@photo.jpg"`}
                />
            )}
        </Card>
    );
}
