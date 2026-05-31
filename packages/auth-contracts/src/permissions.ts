import z from 'zod';

export const PERMISSIONS = {
  // Stock — Inventaire
  STOCK_INVENTORY_READ: 'stock:inventory:read',
  STOCK_INVENTORY_CREATE: 'stock:inventory:create',
  STOCK_INVENTORY_UPDATE: 'stock:inventory:update',
  STOCK_INVENTORY_DELETE: 'stock:inventory:delete',
  STOCK_INVENTORY_CODE_READ: 'stock:inventory:code:read',

  // Stock — Item
  STOCK_ITEM_READ: 'stock:item:read',
  STOCK_ITEM_UPDATE: 'stock:item:update',

  // Stock — Transaction
  STOCK_TRANSACTION_READ: 'stock:transaction:read',
  STOCK_TRANSACTION_CREATE: 'stock:transaction:create',
  STOCK_TRANSACTION_CANCEL: 'stock:transaction:cancel',

  // Stock — Niveau de stock
  STOCK_LEVEL_READ: 'stock:stock-level:read',
  STOCK_LEVEL_UPDATE: 'stock:stock-level:update',

  // Krang — Référence
  KRANG_REFERENCE_READ: 'krang:reference:read',
  KRANG_REFERENCE_CREATE: 'krang:reference:create',
  KRANG_REFERENCE_UPDATE: 'krang:reference:update',
  KRANG_REFERENCE_DELETE: 'krang:reference:delete',

  // Krang — Item
  KRANG_ITEM_READ: 'krang:item:read',
  KRANG_ITEM_CREATE: 'krang:item:create',
  KRANG_ITEM_UPDATE: 'krang:item:update',
  KRANG_ITEM_DELETE: 'krang:item:delete',

  // Krang — Location
  KRANG_LOCATION_READ: 'krang:location:read',
  KRANG_LOCATION_CREATE: 'krang:location:create',
  KRANG_LOCATION_UPDATE: 'krang:location:update',
  KRANG_LOCATION_DELETE: 'krang:location:delete',

  // Krang — Location
  KRANG_TOWN_READ: 'krang:town:read',
  KRANG_TOWN_CREATE: 'krang:town:create',
  KRANG_TOWN_UPDATE: 'krang:town:update',
  KRANG_TOWN_DELETE: 'krang:town:delete',

  // Krang — Location
  KRANG_REGION_READ: 'krang:region:read',
  KRANG_REGION_CREATE: 'krang:region:create',
  KRANG_REGION_UPDATE: 'krang:region:update',
  KRANG_REGION_DELETE: 'krang:region:delete',

  // Admin — Utilisateurs
  COUCOU: 'admin:wanshitong:read',
  ADMIN_USERS_READ: 'admin:users:read',
  ADMIN_USERS_MANAGE: 'admin:users:manage',

  // Admin — Rôles applicatifs
  ADMIN_ROLES_READ: 'admin:roles:read',
  ADMIN_ROLES_MANAGE: 'admin:roles:manage',

  // Admin — Permissions
  ADMIN_PERMISSIONS_READ: 'admin:permissions:read',
  ADMIN_PERMISSIONS_MANAGE: 'admin:permissions:manage',

  // Admin — Mapping Discord
  ADMIN_DISCORD_MAPPING_READ: 'admin:discord-mapping:read',
  ADMIN_DISCORD_MAPPING_MANAGE: 'admin:discord-mapping:manage',

  // Admin — Sessions
  ADMIN_SESSIONS_READ: 'admin:sessions:read',
  ADMIN_SESSIONS_REVOKE: 'admin:sessions:revoke',
} as const;

export const PermissionSchema = z.enum(PERMISSIONS);
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
