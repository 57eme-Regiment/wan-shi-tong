import 'dotenv/config';
import * as schema from '../drizzle/schema';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  [PERMISSIONS.STOCK_INVENTORY_READ]:   'Consulter la liste des inventaires',
  [PERMISSIONS.STOCK_INVENTORY_CREATE]: 'Créer un nouvel inventaire',
  [PERMISSIONS.STOCK_INVENTORY_UPDATE]: 'Modifier un inventaire existant',
  [PERMISSIONS.STOCK_INVENTORY_DELETE]: 'Supprimer un inventaire',

  [PERMISSIONS.STOCK_ITEM_READ]:   'Consulter les articles en stock',
  [PERMISSIONS.STOCK_ITEM_UPDATE]: 'Modifier un article en stock',

  [PERMISSIONS.STOCK_TRANSACTION_READ]:   'Consulter les transactions',
  [PERMISSIONS.STOCK_TRANSACTION_CREATE]: 'Créer une transaction (dépôt, retrait, transfert)',
  [PERMISSIONS.STOCK_TRANSACTION_CANCEL]: 'Annuler une transaction',

  [PERMISSIONS.STOCK_LEVEL_READ]:   'Consulter les niveaux de stock',
  [PERMISSIONS.STOCK_LEVEL_UPDATE]: 'Mettre à jour un niveau de stock',

  [PERMISSIONS.KRANG_REFERENCE_READ]:   'Consulter les données de référence Krang',
  [PERMISSIONS.KRANG_REFERENCE_CREATE]: 'Créer une donnée de référence Krang',
  [PERMISSIONS.KRANG_REFERENCE_UPDATE]: 'Modifier une donnée de référence Krang',
  [PERMISSIONS.KRANG_REFERENCE_DELETE]: 'Supprimer une donnée de référence Krang',

  [PERMISSIONS.KRANG_ITEM_READ]:   'Consulter les items Krang',
  [PERMISSIONS.KRANG_ITEM_CREATE]: 'Créer un item Krang',
  [PERMISSIONS.KRANG_ITEM_UPDATE]: 'Modifier un item Krang',
  [PERMISSIONS.KRANG_ITEM_DELETE]: 'Supprimer un item Krang',

  [PERMISSIONS.KRANG_LOCATION_READ]:   'Consulter les localisations Krang',
  [PERMISSIONS.KRANG_LOCATION_CREATE]: 'Créer une localisation Krang',
  [PERMISSIONS.KRANG_LOCATION_UPDATE]: 'Modifier une localisation Krang',
  [PERMISSIONS.KRANG_LOCATION_DELETE]: 'Supprimer une localisation Krang',

  [PERMISSIONS.ADMIN_USERS_READ]:   'Consulter la liste des utilisateurs',
  [PERMISSIONS.ADMIN_USERS_MANAGE]: 'Gérer les comptes utilisateurs (activation, désactivation)',

  [PERMISSIONS.ADMIN_ROLES_READ]:   'Consulter les rôles applicatifs',
  [PERMISSIONS.ADMIN_ROLES_MANAGE]: 'Créer, modifier et supprimer des rôles applicatifs',

  [PERMISSIONS.ADMIN_PERMISSIONS_READ]:   'Consulter les permissions',
  [PERMISSIONS.ADMIN_PERMISSIONS_MANAGE]: 'Attribuer ou retirer des permissions manuellement',

  [PERMISSIONS.ADMIN_DISCORD_MAPPING_READ]:   'Consulter les mappings rôles Discord → rôles applicatifs',
  [PERMISSIONS.ADMIN_DISCORD_MAPPING_MANAGE]: 'Créer et modifier les mappings Discord',

  [PERMISSIONS.ADMIN_SESSIONS_READ]:   'Consulter les sessions actives',
  [PERMISSIONS.ADMIN_SESSIONS_REVOKE]: 'Révoquer une session utilisateur',
};

const BASE_ROLES = [
  {
    key: 'regiment-member',
    name: 'Regiment Member',
    description: 'Droits de base pour un membre du regiment',
    permissions: [
      PERMISSIONS.STOCK_INVENTORY_READ,
      PERMISSIONS.STOCK_ITEM_READ,
      PERMISSIONS.STOCK_LEVEL_READ,
    ],
  },
  {
    key: 'stock-user',
    name: 'Stock User',
    description: 'Lecture et transactions basiques sur les stocks',
    permissions: [
      PERMISSIONS.STOCK_INVENTORY_READ,
      PERMISSIONS.STOCK_ITEM_READ,
      PERMISSIONS.STOCK_TRANSACTION_READ,
      PERMISSIONS.STOCK_TRANSACTION_CREATE,
      PERMISSIONS.STOCK_LEVEL_READ,
    ],
  },
  {
    key: 'stock-manager',
    name: 'Stock Manager',
    description: 'Gestion complète des inventaires et des stocks',
    permissions: [
      PERMISSIONS.STOCK_INVENTORY_READ,
      PERMISSIONS.STOCK_INVENTORY_CREATE,
      PERMISSIONS.STOCK_INVENTORY_UPDATE,
      PERMISSIONS.STOCK_ITEM_READ,
      PERMISSIONS.STOCK_ITEM_UPDATE,
      PERMISSIONS.STOCK_TRANSACTION_READ,
      PERMISSIONS.STOCK_TRANSACTION_CREATE,
      PERMISSIONS.STOCK_TRANSACTION_CANCEL,
      PERMISSIONS.STOCK_LEVEL_READ,
      PERMISSIONS.STOCK_LEVEL_UPDATE,
    ],
  },
  {
    key: 'krang-maintainer',
    name: 'Krang Maintainer',
    description: 'Gestion des données de référence Krang',
    permissions: [
      PERMISSIONS.KRANG_REFERENCE_READ,
      PERMISSIONS.KRANG_REFERENCE_CREATE,
      PERMISSIONS.KRANG_REFERENCE_UPDATE,
      PERMISSIONS.KRANG_REFERENCE_DELETE,
      PERMISSIONS.KRANG_ITEM_READ,
      PERMISSIONS.KRANG_ITEM_CREATE,
      PERMISSIONS.KRANG_ITEM_UPDATE,
      PERMISSIONS.KRANG_ITEM_DELETE,
      PERMISSIONS.KRANG_LOCATION_READ,
      PERMISSIONS.KRANG_LOCATION_CREATE,
      PERMISSIONS.KRANG_LOCATION_UPDATE,
      PERMISSIONS.KRANG_LOCATION_DELETE,
    ],
  },
  {
    key: 'admin',
    name: 'Administrateur',
    description: 'Accès complet à la gestion des droits et des utilisateurs',
    permissions: [
      PERMISSIONS.ADMIN_USERS_READ,
      PERMISSIONS.ADMIN_USERS_MANAGE,
      PERMISSIONS.ADMIN_ROLES_READ,
      PERMISSIONS.ADMIN_ROLES_MANAGE,
      PERMISSIONS.ADMIN_PERMISSIONS_READ,
      PERMISSIONS.ADMIN_PERMISSIONS_MANAGE,
      PERMISSIONS.ADMIN_DISCORD_MAPPING_READ,
      PERMISSIONS.ADMIN_DISCORD_MAPPING_MANAGE,
      PERMISSIONS.ADMIN_SESSIONS_READ,
      PERMISSIONS.ADMIN_SESSIONS_REVOKE,
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
      .values({ key: roleDef.key, name: roleDef.name, description: roleDef.description })
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
