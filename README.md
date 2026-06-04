# wan-shi-tong

Service centralisé d'authentification et d'autorisation pour l'écosystème 57ème Régiment.

---

## Démarrage rapide

```bash
# 1. Copier les variables d'environnement
cp .env.example .env
# → remplir les valeurs manquantes (voir .env.example)

# 2. Installer les dépendances
pnpm install

# 3. Créer les tables et seeder
pnpm prisma migrate dev --name init
pnpm prisma db seed

# 4. Lancer le serveur
pnpm dev
```

Le serveur démarre sur `http://wanshitong.57regiment.local:3001` par défaut.

---

## Configuration des domaines locaux

En développement, les services utilisent des domaines dédiés plutôt que des ports :

| Service    | Domaine local                 | Port |
| ---------- | ----------------------------- | ---- |
| WanShiTong | `wanshitong.57regiment.local` | 3001 |
| Krang      | `krang.57regiment.local`      | 3002 |
| Renenutet  | `renenutet.57regiment.local`  | 3003 |
| Hermes     | `hermes.57regiment.local`     | 5173 |
| FoxWatcher | `foxwatcher.57regiment.local` | 5174 |

Pour que ces domaines fonctionnent, chaque poste doit déclarer les entrées dans son fichier `hosts`.

### Windows

1. Ouvrir **Notepad** (ou tout éditeur de texte) **en tant qu'administrateur**
2. Ouvrir le fichier : `C:\Windows\System32\drivers\etc\hosts`
3. Ajouter les lignes suivantes à la fin du fichier :

```
127.0.0.1   wanshitong.57regiment.local
127.0.0.1   renenutet.57regiment.local
127.0.0.1   krang.57regiment.local
127.0.0.1   hermes.57regiment.local
127.0.0.1   foxwatcher.57regiment.local
```

4. Sauvegarder
5. Vider le cache DNS si nécessaire :

```powershell
ipconfig /flushdns
```

---

### Linux — Bazzite / Ubuntu / Debian / Fedora

1. Éditer `/etc/hosts` avec les droits root :

```bash
sudo nano /etc/hosts
# ou
sudo vim /etc/hosts
```

2. Ajouter à la fin du fichier :

```
127.0.0.1   wanshitong.57regiment.local
127.0.0.1   renenutet.57regiment.local
127.0.0.1   krang.57regiment.local
127.0.0.1   hermes.57regiment.local
127.0.0.1   foxwatcher.57regiment.local
```

3. Sauvegarder. Les changements sont immédiats (pas de redémarrage nécessaire).

> **Vérification** : `ping wanshitong.57regiment.local` doit répondre sur `127.0.0.1`

---

### NixOS

Sur NixOS, `/etc/hosts` est géré par la configuration système. Ne pas éditer le fichier directement — il sera écrasé au prochain rebuild.

Ajouter dans `configuration.nix` :

```nix
networking.hosts = {
  "127.0.0.1" = [
    "wanshitong.57regiment.local"
    "renenutet.57regiment.local"
    "krang.57regiment.local"
    "hermes.57regiment.local"
    "foxwatcher.57regiment.local"
  ];
};
```

Puis appliquer :

```bash
sudo nixos-rebuild switch
```

---

### Mise à jour du `.env`

Une fois le fichier `hosts` configuré, mettre à jour `.env` :

```env
BETTER_AUTH_URL=http://wanshitong.57regiment.local:3001
CORS_ORIGINS=http://hermes.57regiment.local:5173,http://foxwatcher.57regiment.local:5174
```

> Le port reste obligatoire en développement. Pour l'enlever, un reverse proxy (Caddy, Nginx) est nécessaire.

### Restreindre l'accès au domaine

Par défaut, l'app répond à toute requête quel que soit le hostname (`localhost`, IP, etc.). Pour n'accepter que `wanshitong.57regiment.local`, définir `ALLOWED_HOST` dans `.env` :

```env
ALLOWED_HOST=wanshitong.57regiment.local
```

Toute requête dont le header `Host` ne correspond pas reçoit un `404`. Laisser la variable vide (ou absente) pour tout accepter — utile en CI ou pour les tests automatisés.

---

## Architecture des routes

Les routes sont définies par contrat (ts-rest) dans le package `packages/auth-contracts`. Chaque endpoint est décrit une seule fois dans le contrat (méthode HTTP, chemin, body, params, réponses, summary).

### Pattern `declareRoute`

Les fichiers `*.routes.ts` n'utilisent **jamais** `server.get/post/put/delete` directement. Ils passent par l'utilitaire `declareRoute` qui extrait automatiquement la méthode, le chemin et les schémas Zod depuis le contrat :

```typescript
// ✅ correct
declareRoute(server, adminRoleContract.createRole, ctrl.create.bind(ctrl));

// ❌ à ne pas faire
server.post('/admin/roles', { schema: { body: CreateRoleSchema, ... } }, ctrl.create.bind(ctrl));
```

### Chemins absolus dans les contrats

Tous les contrats définissent des **chemins absolus** (ex. `/admin/roles`, `/access/me`). Les fichiers de route sont donc enregistrés **sans préfixe** dans `app.ts` et `admin.routes.ts`. Ajouter un préfixe doublerait le chemin.

### Ajouter un nouvel endpoint

1. Déclarer l'endpoint dans le fichier contrat correspondant dans `packages/auth-contracts/src/contracts/`
2. Ajouter `declareRoute(server, contract.monEndpoint, ctrl.maMethode.bind(ctrl))` dans le fichier route correspondant
3. Implémenter la méthode dans le contrôleur

### Structure des fichiers

```
packages/auth-contracts/src/
├── contracts/          ← source unique de vérité (méthode, path, schemas)
├── schemas/            ← schémas Zod partagés
└── index.ts            ← exports publics du package

src/
├── services/           ← routes publiques (access, users)
├── servicesAdmin/      ← routes admin (roles, permissions, users, sessions…)
│   └── admin.routes.ts ← agrège les sous-routeurs admin
├── authorize/          ← route d'autorisation inter-services
└── lib/auth/           ← routes Better Auth (gestion native)
```

---

## Tester avec Bruno

Les routes Better Auth sont exposées sous le préfixe `/api/auth` (défaut Better Auth).

**Login Discord** — ouvrir dans le navigateur :

```
http://wanshitong.57regiment.local:3001/api/auth/sign-in/social?provider=discord&callbackURL=http://wanshitong.57regiment.local:3001
```

Après autorisation Discord, récupérer le cookie `better-auth.session_token` dans les DevTools (`F12` → Application → Cookies) et le coller dans la variable `sessionCookie` de l'environnement Bruno `local`.
