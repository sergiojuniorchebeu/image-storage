# Guide API — Stockage d'images & PDF

Cette API vous permet d'envoyer une image ou un PDF depuis votre app et de
recevoir en retour une URL publique, directement utilisable (par exemple
comme `Image.network(url)` en Flutter).

## 1. Récupérer votre clé API

1. Créez un compte sur `/register`.
2. Dans votre dashboard, cliquez sur **Générer ma clé API**.
3. Copiez la clé immédiatement : elle ne sera **plus jamais réaffichée**. Si
   vous la perdez, régénérez-en une nouvelle depuis le dashboard (l'ancienne
   sera désactivée).

Gardez cette clé secrète : ne la commitez jamais dans un dépôt public. Dans
une app Flutter, passez-la via `--dart-define` ou un fichier `.env` ignoré
par git, pas en dur dans le code.

## 2. Authentification

Toutes les requêtes vers `/api/v1/*` doivent inclure votre clé dans l'en-tête
`Authorization` :

```
Authorization: Bearer VOTRE_CLE_API
```

## 3. Limites

| Limite                          | Valeur par défaut |
| -------------------------------- | ------------------ |
| Espace de stockage par étudiant | 15 Mo (gratuit, ajustable par l'admin) |
| Taille max par image             | 5 Mo |
| Taille max par PDF                | 10 Mo |
| Formats acceptés                  | JPEG, PNG, WEBP, PDF |
| Requêtes par minute               | 30 |

Un dépassement de quota ou de taille renvoie une erreur `422` avec un message
explicite (voir §6).

## 4. Envoyer un fichier

`POST /api/v1/files`

Requête en `multipart/form-data`, champ `file`.

### curl

```bash
curl -X POST https://votre-domaine.test/api/v1/files \
  -H "Authorization: Bearer VOTRE_CLE_API" \
  -F "file=@photo.jpg"
```

### Flutter / Dart (package `http`)

```dart
import 'package:http/http.dart' as http;

Future<String> uploadFile(String apiKey, File file) async {
  final request = http.MultipartRequest(
    'POST',
    Uri.parse('https://votre-domaine.test/api/v1/files'),
  )
    ..headers['Authorization'] = 'Bearer $apiKey'
    ..files.add(await http.MultipartFile.fromPath('file', file.path));

  final response = await request.send();
  final body = await response.stream.bytesToString();

  if (response.statusCode != 201) {
    throw Exception('Upload échoué (${response.statusCode}): $body');
  }

  final data = jsonDecode(body) as Map<String, dynamic>;
  return data['data']['url'] as String; // URL publique du fichier
}
```

### Réponse (201 Created)

```json
{
  "data": {
    "id": 42,
    "uuid": "c3a1e6f0-...-9b21",
    "original_name": "photo.jpg",
    "mime_type": "image/jpeg",
    "type": "image",
    "size": 184320,
    "url": "https://votre-domaine.test/storage/uploads/7/c3a1e6f0....jpg",
    "created_at": "2026-09-14T12:00:00.000000Z"
  }
}
```

Le champ `url` est ce que vous stockez et affichez dans votre app.

## 5. Lister vos fichiers

`GET /api/v1/files`

```bash
curl https://votre-domaine.test/api/v1/files \
  -H "Authorization: Bearer VOTRE_CLE_API"
```

Renvoie `{ "data": [ ... ] }`, la liste de vos fichiers (les plus récents en
premier).

## 6. Supprimer un fichier

`DELETE /api/v1/files/{id}`

```bash
curl -X DELETE https://votre-domaine.test/api/v1/files/42 \
  -H "Authorization: Bearer VOTRE_CLE_API"
```

Renvoie `204 No Content` en cas de succès. `403` si le fichier ne vous
appartient pas.

## 7. Erreurs courantes

| Code | Cas                                  | Exemple de message                                      |
| ---- | ------------------------------------- | --------------------------------------------------------- |
| 401  | Clé API manquante ou invalide         | —                                                          |
| 422  | Type de fichier non autorisé          | `Type de fichier non autorisé : text/plain. Formats acceptés : JPEG, PNG, WEBP, PDF.` |
| 422  | Fichier trop volumineux pour son type | `Fichier trop volumineux pour le type "image". Taille maximale : 5 Mo.` |
| 422  | Quota de stockage dépassé             | `Quota de stockage dépassé. Il vous reste 12.4 Mo disponibles.` |
| 429  | Trop de requêtes                      | Attendez avant de réessayer (limite : 30/min)              |
| 403  | Action sur un fichier qui n'est pas le vôtre | —                                                    |

## 8. Client Dart complet

Une petite classe à copier dans votre projet Flutter (dépendance : `http`) :

```dart
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class StockImgClient {
  StockImgClient({required this.baseUrl, required this.apiKey});

  final String baseUrl;
  final String apiKey;

  Map<String, String> get _headers => {'Authorization': 'Bearer $apiKey'};

  Future<String> uploadFile(File file) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/api/v1/files'),
    )
      ..headers.addAll(_headers)
      ..files.add(await http.MultipartFile.fromPath('file', file.path));

    final response = await request.send();
    final body = await response.stream.bytesToString();

    if (response.statusCode != 201) {
      throw Exception('Upload échoué (${response.statusCode}): $body');
    }

    final data = jsonDecode(body) as Map<String, dynamic>;
    return (data['data'] as Map<String, dynamic>)['url'] as String;
  }

  Future<List<Map<String, dynamic>>> listFiles() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/v1/files'),
      headers: _headers,
    );
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    return (data['data'] as List).cast<Map<String, dynamic>>();
  }

  Future<void> deleteFile(int id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/v1/files/$id'),
      headers: _headers,
    );

    if (response.statusCode != 204) {
      throw Exception('Suppression échouée (${response.statusCode})');
    }
  }
}
```

## 9. Utilisation avec image_picker

```dart
final client = StockImgClient(
  baseUrl: 'https://votre-domaine.test',
  apiKey: const String.fromEnvironment('STOCKIMG_API_KEY'),
);

Future<void> pickAndUpload() async {
  final picker = ImagePicker();
  final picked = await picker.pickImage(source: ImageSource.gallery);
  if (picked == null) return;

  final url = await client.uploadFile(File(picked.path));

  setState(() => _avatarUrl = url); // à afficher avec Image.network(url)
}
```

## 10. Utiliser StockImg avec Firebase

Le principe : **Firebase (Auth, Firestore) continue de gérer vos données**
(utilisateurs, posts, relations…), et **StockImg ne gère que les fichiers**
(images, PDF). Vous envoyez le fichier à StockImg, il vous renvoie une URL,
et cette URL est enregistrée comme un simple champ texte dans votre document
Firestore — exactement comme vous le feriez avec l'URL d'un Firebase
Storage.

### Exemple : créer un post avec une image

```dart
final client = StockImgClient(
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
Image.network(post['imageUrl'] as String);
```

### Migrer un projet qui utilise déjà Firebase Storage

Rien à changer côté Firebase : remplacez uniquement l'appel à
`FirebaseStorage` par `client.uploadFile(...)`, et stockez l'URL renvoyée
exactement comme vous stockiez celle de Firebase Storage.

```dart
// AVANT — upload vers Firebase Storage
final ref = FirebaseStorage.instance.ref('avatars/${user.uid}.jpg');
await ref.putFile(file);
final url = await ref.getDownloadURL();

await FirebaseFirestore.instance.collection('users').doc(user.uid).update({
  'avatarUrl': url,
});
```

```dart
// APRÈS — upload vers StockImg, Firestore inchangé
final url = await client.uploadFile(file);

await FirebaseFirestore.instance.collection('users').doc(user.uid).update({
  'avatarUrl': url, // même champ, juste une autre source d'URL
});
```

Côté affichage, rien ne change non plus : `Image.network(user.avatarUrl)`
fonctionne aussi bien avec une URL StockImg qu'avec une URL Firebase Storage.

## Bon à savoir

- Les URLs renvoyées sont publiques et permanentes tant que vous ne supprimez
  pas le fichier — pas besoin de vous authentifier pour les afficher.
- Cet outil est fourni à des fins pédagogiques, dans le cadre du cours.
  N'y stockez pas de données sensibles ou personnelles de tiers.
- La version interactive de ce guide est disponible dans l'application, sur
  la route `/docs`.
