# StockImg — Stockage d'images & PDF pour étudiants

Service pédagogique simple : chaque étudiant crée un compte, récupère une clé
API, et peut envoyer des images ou des PDF pour recevoir une URL publique en
retour — sans avoir à configurer Firebase Storage ou un bucket S3.

## Stack

- **Backend** : Laravel 13, Inertia (rendu server-driven), Sanctum (clés API)
- **Frontend** : React 19 + TypeScript, Tailwind CSS v4
- **Base de données** : SQLite en local (`database/database.sqlite`)
- **Stockage fichiers** : disque `public` (local) par défaut, remplaçable par S3/R2 en production

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed        # crée un compte admin + un compte étudiant démo
php artisan storage:link   # nécessaire pour que /storage/... serve les fichiers

npm install
npm run dev                # ou npm run build en production
php artisan serve
```

`php artisan db:seed` exécute deux seeders dédiés : `AdminSeeder` et
`UserSeeder` (voir `database/seeders/`). Comptes créés (mot de passe :
`password`) :

| Rôle    | Email                     |
| ------- | ------------------------- |
| Admin   | `mitechsarlu@gmail.com`   |
| Étudiant démo | `etudiant@example.com` |

## Architecture

### Rôles et quotas

- Chaque utilisateur a un `role` (`student` ou `admin`) et un
  `storage_quota_mb` (15 Mo par défaut à l'inscription, gratuit).
- Le quota est vérifié à chaque upload dans `App\Services\FileUploadService`.
- Un admin peut ajuster le quota de n'importe quel étudiant depuis `/admin`.

### Deux façons d'uploader

1. **Dashboard web** (`/dashboard`, session Laravel) — l'étudiant glisse ses
   fichiers directement dans le navigateur.
2. **API publique** (`/api/v1/files`, clé Sanctum) — c'est celle que les
   étudiants utilisent depuis leurs propres apps (Flutter, web, etc.). Voir
   [`docs/api.md`](docs/api.md), le guide destiné aux étudiants.

Les deux passent par le même `FileUploadService`, donc les règles (types
acceptés, taille max, quota) sont appliquées de façon identique.

### Configuration des limites

Tout se règle dans `config/uploads.php` / les variables `.env` :

```
UPLOADS_DISK=public
UPLOADS_DEFAULT_QUOTA_MB=15
UPLOADS_MAX_IMAGE_KB=5120
UPLOADS_MAX_PDF_KB=10240
UPLOADS_RATE_LIMIT_PER_MINUTE=30
```

Types acceptés : `image/jpeg`, `image/png`, `image/webp`, `application/pdf`.

### Routes principales

| Route                          | Auth            | Description                          |
| ------------------------------ | --------------- | ------------------------------------- |
| `GET /`                        | publique        | Landing page                          |
| `GET/POST /login`, `/register` | invité          | Authentification                      |
| `GET /dashboard`                | session         | Espace étudiant                       |
| `POST /dashboard/files`         | session         | Upload (dashboard)                    |
| `DELETE /dashboard/files/{id}`  | session         | Suppression (dashboard)               |
| `POST /dashboard/token`         | session         | Génère/régénère la clé API            |
| `GET /admin`                    | session + admin | Liste des étudiants et de leur usage  |
| `PATCH /admin/users/{id}`       | session + admin | Modifie le quota d'un étudiant        |
| `POST /admin/users/{id}/revoke-token` | session + admin | Révoque la clé API d'un étudiant |
| `POST /api/v1/files`            | clé API         | Upload (utilisé par les apps étudiantes) |
| `GET /api/v1/files`             | clé API         | Liste des fichiers de l'utilisateur   |
| `DELETE /api/v1/files/{id}`     | clé API         | Suppression                           |

### Design system

Palette pastel définie dans `resources/css/app.css` (`@theme`), sans
dégradés — inspirée des composants iOS (coins arrondis, ombres douces,
champs à fond teinté). Composants réutilisables dans
`resources/js/components/ui/`.

### Images

Aucune image/illustration n'est incluse — les emplacements sont prêts à
recevoir vos propres visuels (PNG/SVG à fond transparent), sans rien casser
tant qu'ils ne sont pas ajoutés :

| Emplacement | Utilisé par |
| --- | --- |
| `public/images/illustrations/login.png` | Page de connexion |
| `public/images/illustrations/register.png` | Page d'inscription |
| `public/images/services/images.png` | Carte « Stockage d'images » (landing) |
| `public/images/services/pdf.png` | Carte « Stockage de PDF » (landing) |
| `public/images/services/api-key.png` | Carte « Clé API » (landing) |
| `public/images/services/dashboard.png` | Carte « Suivi de votre espace » (landing) |

## Passer en production

- Remplacer `UPLOADS_DISK=public` par un disque S3-compatible
  (`config/filesystems.php` a déjà un disque `s3` prêt) pour ne pas stocker
  les fichiers sur le disque du serveur.
- Vérifier `upload_max_filesize` / `post_max_size` dans `php.ini` (et
  `client_max_body_size` si Nginx) : doivent être ≥ à `UPLOADS_MAX_PDF_KB`.
- Passer `DB_CONNECTION` sur MySQL/PostgreSQL si le nombre d'étudiants
  devient important (SQLite convient pour une classe).
