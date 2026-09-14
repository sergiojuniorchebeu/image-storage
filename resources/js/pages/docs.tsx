import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { GuestLayout } from '@/layouts/guest-layout';
import { Head } from '@inertiajs/react';

const sections = [
    { id: 'cle-api', label: 'Récupérer votre clé' },
    { id: 'auth', label: 'Authentification' },
    { id: 'limites', label: 'Limites' },
    { id: 'envoyer', label: 'Envoyer un fichier' },
    { id: 'lister', label: 'Lister vos fichiers' },
    { id: 'supprimer', label: 'Supprimer un fichier' },
    { id: 'erreurs', label: 'Erreurs courantes' },
    { id: 'client-dart', label: 'Client Dart complet' },
    { id: 'image-picker', label: 'Avec image_picker' },
    { id: 'firebase', label: 'Utiliser avec Firebase' },
];

const limits = [
    ['Espace de stockage par étudiant', '15 Mo (ajustable par l’admin)'],
    ['Taille max par image', '5 Mo'],
    ['Taille max par PDF', '10 Mo'],
    ['Formats acceptés', 'JPEG, PNG, WEBP, PDF'],
    ['Requêtes par minute', '30'],
];

const errors = [
    ['401', 'Clé API manquante ou invalide'],
    ['422', 'Type de fichier non autorisé'],
    ['422', 'Fichier trop volumineux pour son type'],
    ['422', 'Quota de stockage dépassé'],
    ['429', 'Trop de requêtes (limite : 30/min)'],
    ['403', 'Action sur un fichier qui n’est pas le vôtre'],
];

const dartSnippet = `Future<String> uploadFile(String apiKey, File file) async {
  final request = http.MultipartRequest(
    'POST',
    Uri.parse('https://votre-domaine.test/api/v1/files'),
  )
    ..headers['Authorization'] = 'Bearer \$apiKey'
    ..files.add(await http.MultipartFile.fromPath('file', file.path));

  final response = await request.send();
  final body = await response.stream.bytesToString();

  if (response.statusCode != 201) {
    throw Exception('Upload échoué (\${response.statusCode}): \$body');
  }

  final data = jsonDecode(body) as Map<String, dynamic>;
  return data['data']['url'] as String; // URL publique du fichier
}`;

const clientDartSnippet = `import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

/// Client minimal pour l'API StockImg.
class StockImgClient {
  StockImgClient({required this.baseUrl, required this.apiKey});

  final String baseUrl;
  final String apiKey;

  Map<String, String> get _headers => {'Authorization': 'Bearer \$apiKey'};

  /// Envoie un fichier (image ou PDF) et renvoie son URL publique.
  Future<String> uploadFile(File file) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('\$baseUrl/api/v1/files'),
    )
      ..headers.addAll(_headers)
      ..files.add(await http.MultipartFile.fromPath('file', file.path));

    final response = await request.send();
    final body = await response.stream.bytesToString();

    if (response.statusCode != 201) {
      throw Exception('Upload échoué (\${response.statusCode}): \$body');
    }

    final data = jsonDecode(body) as Map<String, dynamic>;
    return (data['data'] as Map<String, dynamic>)['url'] as String;
  }

  /// Liste les fichiers déjà envoyés par l'utilisateur.
  Future<List<Map<String, dynamic>>> listFiles() async {
    final response = await http.get(
      Uri.parse('\$baseUrl/api/v1/files'),
      headers: _headers,
    );
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    return (data['data'] as List).cast<Map<String, dynamic>>();
  }

  /// Supprime un fichier par son id.
  Future<void> deleteFile(int id) async {
    final response = await http.delete(
      Uri.parse('\$baseUrl/api/v1/files/\$id'),
      headers: _headers,
    );

    if (response.statusCode != 204) {
      throw Exception('Suppression échouée (\${response.statusCode})');
    }
  }
}`;

const imagePickerSnippet = `final client = StockImgClient(
  baseUrl: 'https://votre-domaine.test',
  apiKey: const String.fromEnvironment('STOCKIMG_API_KEY'),
);

Future<void> pickAndUpload() async {
  final picker = ImagePicker();
  final picked = await picker.pickImage(source: ImageSource.gallery);
  if (picked == null) return;

  final url = await client.uploadFile(File(picked.path));

  setState(() => _avatarUrl = url); // à afficher avec Image.network(url)
}`;

const firestoreExampleSnippet = `final client = StockImgClient(
  baseUrl: 'https://votre-domaine.test',
  apiKey: const String.fromEnvironment('STOCKIMG_API_KEY'),
);

Future<void> createPost({
  required String title,
  required String description,
  required File imageFile,
}) async {
  // 1. L'image est envoyée à StockImg, qui renvoie une URL publique.
  final imageUrl = await client.uploadFile(imageFile);

  // 2. Firestore ne stocke que les données "texte" — dont cette URL,
  //    comme un champ normal (String), au même titre que le titre.
  await FirebaseFirestore.instance.collection('posts').add({
    'title': title,
    'description': description,
    'imageUrl': imageUrl,
    'authorId': FirebaseAuth.instance.currentUser!.uid,
    'createdAt': FieldValue.serverTimestamp(),
  });
}

// Affichage plus tard, en lisant le document Firestore :
Image.network(post['imageUrl'] as String);`;

const firebaseBeforeSnippet = `// AVANT — upload vers Firebase Storage
final ref = FirebaseStorage.instance.ref('avatars/\${user.uid}.jpg');
await ref.putFile(file);
final url = await ref.getDownloadURL();

await FirebaseFirestore.instance.collection('users').doc(user.uid).update({
  'avatarUrl': url,
});`;

const firebaseAfterSnippet = `// APRÈS — upload vers StockImg, Firestore inchangé
final url = await client.uploadFile(file);

await FirebaseFirestore.instance.collection('users').doc(user.uid).update({
  'avatarUrl': url, // même champ, juste une autre source d'URL
});`;

const responseSnippet = `{
  "data": {
    "id": 42,
    "original_name": "photo.jpg",
    "mime_type": "image/jpeg",
    "type": "image",
    "size": 184320,
    "url": "https://votre-domaine.test/storage/uploads/7/c3a1e6f0....jpg",
    "created_at": "2026-09-14T12:00:00.000000Z"
  }
}`;

export default function Docs() {
    return (
        <GuestLayout>
            <Head title="Documentation API" />

            <div className="mx-auto max-w-6xl px-6 py-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
                <aside className="hidden lg:block">
                    <nav className="sticky top-10 flex flex-col gap-1">
                        {sections.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className="rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
                            >
                                {s.label}
                            </a>
                        ))}
                    </nav>
                </aside>

                <div className="min-w-0">
                    <nav className="mb-8 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                        {sections.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className="shrink-0 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink-soft"
                            >
                                {s.label}
                            </a>
                        ))}
                    </nav>

                    <header className="mb-12">
                        <Badge tone="primary">Guide développeur</Badge>
                        <h1 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">
                            Documentation API
                        </h1>
                        <p className="mt-3 max-w-2xl text-ink-soft">
                            Envoyez une image ou un PDF depuis votre app, recevez
                            une URL publique en retour. Pensé pour être branché
                            en quelques minutes depuis un projet Flutter, web ou
                            mobile.
                        </p>
                    </header>

                    <div className="flex flex-col gap-14">
                        <section id="cle-api" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-ink">
                                1. Récupérer votre clé API
                            </h2>
                            <ol className="mt-4 flex flex-col gap-2 text-sm text-ink-soft">
                                <li>
                                    1. Créez un compte sur{' '}
                                    <span className="font-medium text-ink">
                                        /register
                                    </span>
                                    .
                                </li>
                                <li>
                                    2. Dans votre dashboard, cliquez sur{' '}
                                    <span className="font-medium text-ink">
                                        Générer ma clé API
                                    </span>
                                    .
                                </li>
                                <li>
                                    3. Copiez la clé immédiatement : elle ne sera{' '}
                                    <span className="font-medium text-danger-ink">
                                        plus jamais réaffichée
                                    </span>
                                    . En cas de perte, régénérez-en une nouvelle
                                    (l’ancienne sera désactivée).
                                </li>
                            </ol>
                            <Card className="mt-4 bg-peach-soft">
                                <p className="text-sm text-peach-ink">
                                    Gardez cette clé secrète : ne la commitez
                                    jamais dans un dépôt public. Dans une app
                                    Flutter, passez-la via{' '}
                                    <code>--dart-define</code> ou un fichier{' '}
                                    <code>.env</code> ignoré par git.
                                </p>
                            </Card>
                        </section>

                        <section id="auth" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-ink">
                                2. Authentification
                            </h2>
                            <p className="mt-3 text-sm text-ink-soft">
                                Toutes les requêtes vers <code>/api/v1/*</code>{' '}
                                doivent inclure votre clé dans l’en-tête{' '}
                                <code>Authorization</code> :
                            </p>
                            <CodeBlock
                                className="mt-4"
                                label="Header"
                                code="Authorization: Bearer VOTRE_CLE_API"
                            />
                        </section>

                        <section id="limites" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-ink">
                                3. Limites
                            </h2>
                            <Card className="mt-4 overflow-hidden p-0">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {limits.map(([label, value]) => (
                                            <tr
                                                key={label}
                                                className="border-b border-line last:border-0"
                                            >
                                                <td className="px-5 py-3 text-ink-soft">
                                                    {label}
                                                </td>
                                                <td className="px-5 py-3 text-right font-medium text-ink">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                            <p className="mt-3 text-xs text-ink-soft">
                                Un dépassement de quota ou de taille renvoie une
                                erreur 422 avec un message explicite.
                            </p>
                        </section>

                        <section id="envoyer" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-ink">
                                4. Envoyer un fichier
                            </h2>
                            <p className="mt-3 text-sm text-ink-soft">
                                <code>POST /api/v1/files</code> — requête en{' '}
                                <code>multipart/form-data</code>, champ{' '}
                                <code>file</code>.
                            </p>
                            <div className="mt-4 flex flex-col gap-4">
                                <CodeBlock
                                    label="curl"
                                    code={`curl -X POST https://votre-domaine.test/api/v1/files \\
  -H "Authorization: Bearer VOTRE_CLE_API" \\
  -F "file=@photo.jpg"`}
                                />
                                <CodeBlock
                                    label="Flutter / Dart (package http)"
                                    code={dartSnippet}
                                />
                                <div>
                                    <p className="mb-2 text-xs font-medium text-ink-soft">
                                        Réponse (201 Created)
                                    </p>
                                    <CodeBlock label="JSON" code={responseSnippet} />
                                </div>
                                <p className="text-sm text-ink-soft">
                                    Le champ <code>url</code> est ce que vous
                                    stockez et affichez dans votre app (par
                                    exemple <code>Image.network(url)</code>).
                                </p>
                            </div>
                        </section>

                        <section id="lister" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-ink">
                                5. Lister vos fichiers
                            </h2>
                            <p className="mt-3 text-sm text-ink-soft">
                                <code>GET /api/v1/files</code> renvoie{' '}
                                <code>{'{ "data": [ ... ] }'}</code>, vos
                                fichiers les plus récents en premier.
                            </p>
                            <CodeBlock
                                className="mt-4"
                                label="curl"
                                code={`curl https://votre-domaine.test/api/v1/files \\
  -H "Authorization: Bearer VOTRE_CLE_API"`}
                            />
                        </section>

                        <section id="supprimer" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-ink">
                                6. Supprimer un fichier
                            </h2>
                            <p className="mt-3 text-sm text-ink-soft">
                                <code>DELETE /api/v1/files/{'{id}'}</code>{' '}
                                renvoie <code>204 No Content</code> en cas de
                                succès, <code>403</code> si le fichier ne vous
                                appartient pas.
                            </p>
                            <CodeBlock
                                className="mt-4"
                                label="curl"
                                code={`curl -X DELETE https://votre-domaine.test/api/v1/files/42 \\
  -H "Authorization: Bearer VOTRE_CLE_API"`}
                            />
                        </section>

                        <section id="erreurs" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-ink">
                                7. Erreurs courantes
                            </h2>
                            <Card className="mt-4 overflow-hidden p-0">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {errors.map(([code, label], i) => (
                                            <tr
                                                key={i}
                                                className="border-b border-line last:border-0"
                                            >
                                                <td className="w-20 px-5 py-3">
                                                    <Badge
                                                        tone={
                                                            code === '401' ||
                                                            code === '403'
                                                                ? 'danger'
                                                                : 'peach'
                                                        }
                                                    >
                                                        {code}
                                                    </Badge>
                                                </td>
                                                <td className="px-5 py-3 text-ink-soft">
                                                    {label}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                            <p className="mt-3 text-xs text-ink-soft">
                                Cet outil est fourni à des fins pédagogiques,
                                dans le cadre du cours. N’y stockez pas de
                                données sensibles ou personnelles de tiers.
                            </p>
                        </section>

                        <section id="client-dart" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-ink">
                                8. Client Dart complet
                            </h2>
                            <p className="mt-3 text-sm text-ink-soft">
                                Une petite classe à copier dans votre projet
                                Flutter (dépendance : <code>http</code>).
                                Regroupe l’envoi, la liste et la suppression
                                des fichiers.
                            </p>
                            <CodeBlock
                                className="mt-4"
                                label="lib/services/stockimg_client.dart"
                                code={clientDartSnippet}
                            />
                        </section>

                        <section id="image-picker" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-ink">
                                9. Utilisation avec image_picker
                            </h2>
                            <p className="mt-3 text-sm text-ink-soft">
                                Exemple typique : l’utilisateur choisit une
                                photo depuis la galerie, elle est envoyée, et
                                l’URL reçue remplace l’ancienne (avatar,
                                photo de profil, pièce jointe…).
                            </p>
                            <CodeBlock
                                className="mt-4"
                                label="Dart"
                                code={imagePickerSnippet}
                            />
                        </section>

                        <section id="firebase" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-ink">
                                10. Utiliser StockImg avec Firebase
                            </h2>
                            <p className="mt-3 text-sm text-ink-soft">
                                Le principe : <strong className="text-ink">
                                    Firebase (Auth, Firestore) continue de
                                    gérer vos données
                                </strong>{' '}
                                — utilisateurs, posts, relations… —, et{' '}
                                <strong className="text-ink">
                                    StockImg ne gère que les fichiers
                                </strong>{' '}
                                (images, PDF). Vous envoyez le fichier à
                                StockImg, il vous renvoie une URL, et cette
                                URL est enregistrée comme un simple champ
                                texte dans votre document Firestore — exactement
                                comme vous le feriez avec l’URL d’un
                                Firebase Storage.
                            </p>

                            <h3 className="mt-6 text-sm font-semibold text-ink">
                                Exemple : créer un post avec une image
                            </h3>
                            <CodeBlock
                                className="mt-3"
                                label="Dart — Firestore + StockImg"
                                code={firestoreExampleSnippet}
                            />

                            <h3 className="mt-8 text-sm font-semibold text-ink">
                                Migrer un projet qui utilise Firebase Storage
                            </h3>
                            <p className="mt-2 text-sm text-ink-soft">
                                Rien à changer côté Firebase : remplacez
                                uniquement l’appel à{' '}
                                <code>FirebaseStorage</code> par{' '}
                                <code>client.uploadFile(...)</code>, et
                                stockez l’URL renvoyée exactement comme vous
                                stockiez celle de Firebase Storage.
                            </p>
                            <div className="mt-3 grid gap-4 lg:grid-cols-2">
                                <div>
                                    <p className="mb-2 text-xs font-medium text-danger-ink">
                                        Avant
                                    </p>
                                    <CodeBlock
                                        label="Firebase Storage"
                                        code={firebaseBeforeSnippet}
                                    />
                                </div>
                                <div>
                                    <p className="mb-2 text-xs font-medium text-mint-ink">
                                        Après
                                    </p>
                                    <CodeBlock
                                        label="StockImg"
                                        code={firebaseAfterSnippet}
                                    />
                                </div>
                            </div>
                            <Card className="mt-4 bg-mint-soft">
                                <p className="text-sm text-mint-ink">
                                    Côté affichage, rien ne change non plus :{' '}
                                    <code>Image.network(url)</code> fonctionne
                                    aussi bien avec une URL StockImg qu’avec
                                    une URL Firebase Storage.
                                </p>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
