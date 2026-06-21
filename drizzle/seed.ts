import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import 'dotenv/config';
import { inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../drizzle/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  // Permission d'accès
  [PERMISSIONS.WAN_ACCESS]: "Accéder à l'application Hermes",
  [PERMISSIONS.KRANG_ACCESS]: 'Accéder à la gestion de Krang',
  [PERMISSIONS.RENENUTET_ACCESS]: 'Accéder à la gestion de Renenutet',
  [PERMISSIONS.FOXWATCHER_ACCESS]: "Accéder à l'application FoxWatcher",
  [PERMISSIONS.HERMES_ACCESS]: "Accéder à l'application Hermes",

  // Krang — Items
  [PERMISSIONS.KRANG_ITEMS_READ]: 'Consulter les articles Krang',
  [PERMISSIONS.KRANG_ITEMS_CREATE]: 'Créer des articles Krang',
  [PERMISSIONS.KRANG_ITEMS_MANAGE]: 'Modifier les articles Krang',
  [PERMISSIONS.KRANG_ITEMS_DELETE]: 'Supprimer des articles Krang',

  // Krang — Locations
  [PERMISSIONS.KRANG_LOCATIONS_READ]: 'Consulter les emplacements Krang',
  [PERMISSIONS.KRANG_LOCATIONS_CREATE]: 'Créer des emplacements Krang',
  [PERMISSIONS.KRANG_LOCATIONS_UPDATE]: 'Modifier des emplacements Krang',
  [PERMISSIONS.KRANG_LOCATIONS_DELETE]: 'Supprimer des emplacements Krang',

  // Krang — Towns
  [PERMISSIONS.KRANG_TOWNS_READ]: 'Consulter les villes Krang',
  [PERMISSIONS.KRANG_TOWNS_CREATE]: 'Créer des villes Krang',
  [PERMISSIONS.KRANG_TOWNS_UPDATE]: 'Modifier des villes Krang',
  [PERMISSIONS.KRANG_TOWNS_DELETE]: 'Supprimer des villes Krang',

  // Krang — Regions
  [PERMISSIONS.KRANG_REGIONS_READ]: 'Consulter les régions Krang',
  [PERMISSIONS.KRANG_REGIONS_CREATE]: 'Créer des régions Krang',
  [PERMISSIONS.KRANG_REGIONS_UPDATE]: 'Modifier des régions Krang',
  [PERMISSIONS.KRANG_REGIONS_DELETE]: 'Supprimer des régions Krang',

  // Krang — Maintenance
  [PERMISSIONS.KRANG_MAINTENANCE_RENENUTET]:
    'Effectuer la maintenance Krang pour Renenutet',

  // Wan-Shi-Tong — Utilisateurs
  [PERMISSIONS.WAN_USERS_READ]: 'Consulter les utilisateurs dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_USERS_MANAGE]: 'Gérer les utilisateurs dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_USERS_SETADMIN]:
    "Définir le statut administrateur d'un utilisateur",

  // Wan-Shi-Tong — Rôles
  [PERMISSIONS.WAN_ROLE_READ]: 'Consulter les rôles dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_ROLE_CREATE]: 'Créer des rôles dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_ROLE_MANAGE]: 'Modifier des rôles dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_ROLE_DELETE]: 'Supprimer des rôles dans Wan-Shi-Tong',

  // Wan-Shi-Tong — Permissions
  [PERMISSIONS.WAN_PERMISSION_READ]:
    'Consulter les permissions dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_PERMISSION_CREATE]:
    'Créer des permissions dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_PERMISSION_MANAGE]:
    'Modifier des permissions dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_PERMISSION_DELETE]:
    'Supprimer des permissions dans Wan-Shi-Tong',

  // Wan-Shi-Tong — Overrides
  [PERMISSIONS.WAN_OVERRIDE_READ]: 'Consulter les overrides de permissions',
  [PERMISSIONS.WAN_OVERRIDE_MANAGE]:
    'Créer et modifier les overrides de permissions',
  [PERMISSIONS.WAN_OVERRIDE_DELETE]: 'Supprimer les overrides de permissions',

  // Wan-Shi-Tong — Sessions
  [PERMISSIONS.WAN_SESSION_READ]: 'Consulter les sessions dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_SESSION_REVOKE]: 'Révoquer une session dans Wan-Shi-Tong',

  // Wan-Shi-Tong — Discord Mapping
  [PERMISSIONS.WAN_DISCORD_MAPPING_READ]:
    'Consulter les mappings Discord dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_DISCORD_MAPPING_CREATE]:
    'Créer des mappings Discord dans Wan-Shi-Tong',
  [PERMISSIONS.WAN_DISCORD_MAPPING_DELETE]:
    'Supprimer des mappings Discord dans Wan-Shi-Tong',

  // Renenutet — Inventaires
  [PERMISSIONS.RENENUTET_INVENTORIES_READ]:
    'Consulter les inventaires Renenutet',
  [PERMISSIONS.RENENUTET_INVENTORIES_CREATE]: 'Créer des inventaires Renenutet',
  [PERMISSIONS.RENENUTET_INVENTORIES_UPDATE]:
    'Modifier des inventaires Renenutet',

  // Renenutet — Stocks
  [PERMISSIONS.RENENUTET_STOCKS_READ]:
    'Consulter les niveaux de stock Renenutet',
  [PERMISSIONS.RENENUTET_STOCKS_CREATE]: 'Créer des entrées de stock Renenutet',
  [PERMISSIONS.RENENUTET_STOCKS_INCREMENT]: 'Incrémenter un stock Renenutet',
  [PERMISSIONS.RENENUTET_STOCKS_DECREMENT]: 'Décrémenter un stock Renenutet',
  [PERMISSIONS.RENENUTET_STOCKS_UPDATEMIN]:
    "Modifier le seuil minimum d'un stock Renenutet",

  // Renenutet — Demandes de production
  [PERMISSIONS.RENENUTET_PRODUCTIONREQUEST_READ]:
    'Consulter les demandes de production Renenutet',
  [PERMISSIONS.RENENUTET_PRODUCTIONREQUEST_CREATE]:
    'Créer des demandes de production Renenutet',
  [PERMISSIONS.RENENUTET_PRODUCTIONREQUEST_UPDATE]:
    'Modifier des demandes de production Renenutet',
  [PERMISSIONS.RENENUTET_PRODUCTIONREQUEST_DELETE]:
    'Supprimer des demandes de production Renenutet',

  // Renenutet — Références d'articles
  [PERMISSIONS.RENENUTET_ITEMREF_CREATE]:
    'Associer un article Krang à un inventaire Renenutet',
  [PERMISSIONS.RENENUTET_ITEMREF_DROP]:
    "Retirer un article Krang d'un inventaire Renenutet",

  // Renenutet — Localisations
  [PERMISSIONS.RENENUTET_LOCATIONS_SEARCH]:
    'Rechercher des localisations dans Renenutet',

  // Renenutet — Références de localisations
  [PERMISSIONS.RENENUTET_LOCATIONREF_CREATE]:
    'Associer une localisation Krang à un inventaire Renenutet',
  [PERMISSIONS.RENENUTET_LOCATIONREF_DROP]:
    "Retirer une localisation Krang d'un inventaire Renenutet",
};

const BASE_ROLES = [
  {
    key: 'regiment-member',
    name: 'Regiment Member',
    description: 'Droits de base pour un membre du régiment',
    permissions: [
      PERMISSIONS.KRANG_ITEMS_READ,
      PERMISSIONS.KRANG_LOCATIONS_READ,
      PERMISSIONS.KRANG_TOWNS_READ,
      PERMISSIONS.KRANG_REGIONS_READ,

      PERMISSIONS.HERMES_ACCESS,
      PERMISSIONS.RENENUTET_INVENTORIES_READ,
      PERMISSIONS.RENENUTET_STOCKS_CREATE,
      PERMISSIONS.RENENUTET_STOCKS_READ,
      PERMISSIONS.RENENUTET_STOCKS_INCREMENT,

      PERMISSIONS.RENENUTET_LOCATIONS_SEARCH,
      PERMISSIONS.RENENUTET_PRODUCTIONREQUEST_READ,
    ],
  },
  {
    key: 'logistique',
    name: 'Regiment Member',
    description: "Droit qui permet l'accès logistique aux stocks",
    permissions: [PERMISSIONS.RENENUTET_STOCKS_DECREMENT],
  },
  {
    key: 'officier',
    name: 'Regiment officiers',
    description: 'Permet des droit spécifique pour les officiers.',
    permissions: [
      PERMISSIONS.RENENUTET_INVENTORIES_CREATE,
      PERMISSIONS.RENENUTET_INVENTORIES_UPDATE,
      PERMISSIONS.RENENUTET_STOCKS_UPDATEMIN,

      PERMISSIONS.RENENUTET_PRODUCTIONREQUEST_CREATE,
      PERMISSIONS.RENENUTET_PRODUCTIONREQUEST_UPDATE,
      PERMISSIONS.RENENUTET_PRODUCTIONREQUEST_DELETE,
    ],
  },
  {
    key: 'renenutet-manager',
    name: 'Renenutet Manager',
    description:
      'Gestion complète des inventaires, stocks et demandes de production Renenutet',
    permissions: [
      PERMISSIONS.RENENUTET_ITEMREF_CREATE,
      PERMISSIONS.RENENUTET_ITEMREF_DROP,
      PERMISSIONS.RENENUTET_LOCATIONREF_CREATE,
      PERMISSIONS.RENENUTET_LOCATIONREF_DROP,
      PERMISSIONS.KRANG_ACCESS,
      PERMISSIONS.KRANG_MAINTENANCE_RENENUTET,
    ],
  },
  {
    key: 'krang-maintainer',
    name: 'Krang Maintainer',
    description:
      'Gestion complète des données de référence Krang (articles, emplacements, villes, régions)',
    permissions: [
      PERMISSIONS.KRANG_ITEMS_CREATE,
      PERMISSIONS.KRANG_ITEMS_MANAGE,
      PERMISSIONS.KRANG_ITEMS_DELETE,
      PERMISSIONS.KRANG_LOCATIONS_CREATE,
      PERMISSIONS.KRANG_LOCATIONS_UPDATE,
      PERMISSIONS.KRANG_LOCATIONS_DELETE,
      PERMISSIONS.KRANG_TOWNS_CREATE,
      PERMISSIONS.KRANG_TOWNS_UPDATE,
      PERMISSIONS.KRANG_TOWNS_DELETE,
      PERMISSIONS.KRANG_REGIONS_CREATE,
      PERMISSIONS.KRANG_REGIONS_UPDATE,
      PERMISSIONS.KRANG_REGIONS_DELETE,
    ],
  },
  {
    key: 'wan-admin',
    name: 'Wan-Shi-Tong Admin',
    description:
      "Administration complète du système d'authentification Wan-Shi-Tong",
    permissions: [
      PERMISSIONS.WAN_USERS_READ,
      PERMISSIONS.WAN_USERS_MANAGE,
      PERMISSIONS.WAN_USERS_SETADMIN,
      PERMISSIONS.WAN_ROLE_READ,
      PERMISSIONS.WAN_ROLE_CREATE,
      PERMISSIONS.WAN_ROLE_MANAGE,
      PERMISSIONS.WAN_ROLE_DELETE,
      PERMISSIONS.WAN_PERMISSION_READ,
      PERMISSIONS.WAN_PERMISSION_CREATE,
      PERMISSIONS.WAN_PERMISSION_MANAGE,
      PERMISSIONS.WAN_PERMISSION_DELETE,
      PERMISSIONS.WAN_OVERRIDE_READ,
      PERMISSIONS.WAN_OVERRIDE_MANAGE,
      PERMISSIONS.WAN_OVERRIDE_DELETE,
      PERMISSIONS.WAN_SESSION_READ,
      PERMISSIONS.WAN_SESSION_REVOKE,
      PERMISSIONS.WAN_DISCORD_MAPPING_READ,
      PERMISSIONS.WAN_DISCORD_MAPPING_CREATE,
      PERMISSIONS.WAN_DISCORD_MAPPING_DELETE,
    ],
  },
] as const;

async function main() {
  console.log('🌱 Seeding permissions…');

  const allPermissionKeys = Object.values(PERMISSIONS);

  for (const key of allPermissionKeys) {
    const description = PERMISSION_DESCRIPTIONS[key] ?? null;
    await db
      .insert(schema.permission)
      .values({ key, description })
      .onConflictDoUpdate({
        target: schema.permission.key,
        set: { description },
      });
  }

  console.log(`  ✓ ${allPermissionKeys.length} permissions`);

  console.log('🌱 Seeding roles…');

  for (const roleDef of BASE_ROLES) {
    const [role] = await db
      .insert(schema.role)
      .values({
        key: roleDef.key,
        name: roleDef.name,
        description: roleDef.description,
      })
      .onConflictDoUpdate({
        target: schema.role.key,
        set: { name: roleDef.name, description: roleDef.description },
      })
      .returning();

    const permissions = await db
      .select({ id: schema.permission.id })
      .from(schema.permission)
      .where(inArray(schema.permission.key, [...roleDef.permissions]));

    for (const { id: permissionId } of permissions) {
      await db
        .insert(schema.rolePermission)
        .values({ roleId: role.id, permissionId })
        .onConflictDoNothing();
    }

    console.log(`  ✓ ${roleDef.key} (${permissions.length} permissions)`);
  }

  console.log('✅ Seed terminé');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => client.end());
