# Nabu — Bibliothèque partagée 57ème Régiment

Dépôt central des utilitaires, composants et outils techniques communs à tous les services de l'écosystème. Le code métier (contrats API, schémas domaine) reste dans les dépôts concernés.

---

## Packages

| Package | Scope | Description |
|---|---|---|
| `@57eme-regiment/nabu-errors` | Backend | `AppError`, `createErrorHandler`, `PRISMA_ERROR_MAP` |
| `@57eme-regiment/nabu-logger` | Backend | `createLogger(name)` — factory tslog |
| `@57eme-regiment/nabu-fastify` | Backend | `declareRoute` — pont ts-rest → Fastify |
| `@57eme-regiment/nabu-frontend-utils` | Frontend | `cn`, `HttpError`, `getQueryClient`, `formatDateTime` |
| `@57eme-regiment/nabu-ui` | Frontend | Composants React (base-ui + Tailwind) + providers |

---

## Utiliser Nabu depuis un autre dépôt

Tous les dépôts du workspace sont au même niveau (`/workspace/57regiment/`). On utilise le protocole `portal:` de pnpm pour référencer les packages localement sans les publier.

### 1. Ajouter les dépendances dans `package.json`

```json
{
  "dependencies": {
    "@57eme-regiment/nabu-errors":         "portal:../nabu/packages/errors",
    "@57eme-regiment/nabu-logger":         "portal:../nabu/packages/logger",
    "@57eme-regiment/nabu-fastify":        "portal:../nabu/packages/fastify",
    "@57eme-regiment/nabu-frontend-utils": "portal:../nabu/packages/frontend-utils",
    "@57eme-regiment/nabu-ui":             "portal:../nabu/packages/ui"
  }
}
```

Adapter les chemins si le dépôt consommateur n'est pas au même niveau que `nabu/`.

### 2. Lancer `pnpm install`

pnpm crée un lien symbolique dans `node_modules/` vers le dossier local de chaque package.

### 3. Builder les packages avant utilisation

```bash
cd /workspace/57regiment/nabu
pnpm install
pnpm build
```

En développement, utiliser `pnpm dev` pour recompiler automatiquement lors des modifications :

```bash
pnpm dev   # lance tsc --watch sur tous les packages en parallèle
```

---

## Pour la CI/CD

En CI, tous les dépôts doivent être clonés côte à côte. Avec GitHub Actions :

```yaml
- uses: actions/checkout@v4
  with:
    repository: 57eme-regiment/nabu
    path: nabu
- uses: actions/checkout@v4
  with:
    repository: 57eme-regiment/mon-service
    path: mon-service
```

Alternativement, publier les packages sur GitHub Packages et remplacer les `portal:` par des versions `^x.y.z`.

---

## Backend — `nabu-errors`

```ts
// config/logger.ts (dans chaque service)
import { createLogger } from '@57eme-regiment/nabu-logger';
export const logger = createLogger('Renenutet');

// app.ts
import { createErrorHandler } from '@57eme-regiment/nabu-errors';
import { logger } from '@/config/logger';
app.setErrorHandler(createErrorHandler(logger));
```

`createErrorHandler(logger)` retourne un handler Fastify qui gère :
- `AppError` → status + code métier
- `Prisma.PrismaClientKnownRequestError` → P2002 (409), P2025 (404), P2003 (400)
- `ZodError` → 422 VALIDATION_ERROR
- Erreur inconnue → 500 INTERNAL_ERROR

---

## Backend — `nabu-fastify`

Remplace les `server.get/post/...` manuels. Lit le chemin, la méthode, le body, les params et les réponses directement depuis le contrat ts-rest.

```ts
// Avant
server.get('/admin/roles', { schema: { response: { 200: z.array(AdminRoleSchema) } } }, handler);

// Après
import { declareRoute } from '@57eme-regiment/nabu-fastify';
declareRoute(server, adminRoleContract.getRoles, ctrl.getAll.bind(ctrl));
```

Les contrats doivent définir des **chemins absolus** (ex. `/admin/roles`). Ne pas utiliser de `{ prefix: '...' }` dans `app.register()` — cela doublerait le chemin.

---

## Frontend — `nabu-ui` et Tailwind CSS

`nabu-ui` est compilé en JS (via `tsc`), mais Tailwind a besoin de scanner les **sources TypeScript** pour inclure les classes dans le bundle CSS. Il faut lui indiquer où regarder.

### Tailwind v4 (`@tailwindcss/vite`)

Dans le fichier CSS principal du projet consommateur (ex. `src/globals.css`) :

```css
@import "tailwindcss";
@source "../../nabu/packages/ui/src";   /* ← ajouter */
```

### Tailwind v3 (`tailwind.config.ts`)

```ts
export default {
  content: [
    './src/**/*.{ts,tsx}',
    '../../nabu/packages/ui/src/**/*.{ts,tsx}',  /* ← ajouter */
  ],
}
```

### Variables CSS

`nabu-ui` utilise les variables CSS standard (Tailwind / shadcn) : `--primary`, `--background`, `--card`, `--border`, `--radius`, etc. Ces variables doivent être définies dans le `globals.css` du projet consommateur. Les projets existants ont déjà ces variables — rien à changer.

### Utilisation

```tsx
import {
  Button,
  Card, CardHeader, CardTitle, CardContent,
  Dialog, DialogContent, DialogHeader, DialogTitle,
  ThemeProvider, ThemeToggle,
  LanguageProvider, LanguageToggle,
  useTheme,
} from '@57eme-regiment/nabu-ui';
```

### `LanguageProvider` — passer ses propres locales

Le provider est générique, il n'embarque pas de traductions. Chaque projet fournit ses dictionnaires :

```tsx
import { LanguageProvider } from '@57eme-regiment/nabu-ui';
import { en } from '@/locales/en';
import { fr } from '@/locales/fr';

<LanguageProvider dictionaries={{ en, fr }} defaultLanguage="fr" storageKey="hermes-lang">
  <App />
</LanguageProvider>
```

---

## Frontend — `nabu-frontend-utils`

```ts
import { cn } from '@57eme-regiment/nabu-frontend-utils';
import { HttpError } from '@57eme-regiment/nabu-frontend-utils';
import { getQueryClient } from '@57eme-regiment/nabu-frontend-utils';
import { formatDateTime } from '@57eme-regiment/nabu-frontend-utils';
```

---

## Ajouter un nouveau composant ou utilitaire

1. Écrire le code dans le package approprié (`packages/ui/src/`, `packages/errors/src/`, etc.)
2. L'exporter dans le `src/index.ts` du package
3. Lancer `pnpm build` (ou laisser `pnpm dev` recompiler)
4. Les projets consommateurs reçoivent automatiquement la mise à jour (pas de `pnpm install` requis)

---

## Structure

```
nabu/
├── packages/
│   ├── errors/          @57eme-regiment/nabu-errors
│   ├── logger/          @57eme-regiment/nabu-logger
│   ├── fastify/         @57eme-regiment/nabu-fastify
│   ├── frontend-utils/  @57eme-regiment/nabu-frontend-utils
│   └── ui/              @57eme-regiment/nabu-ui
├── pnpm-workspace.yaml
└── package.json
```
