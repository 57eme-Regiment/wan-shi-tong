import z from 'zod';

export const PERMISSIONS = {
  // Access
  WAN_ACCESS: 'wan:access',
  KRANG_ACCESS: 'krang:access',
  RENENUTET_ACCESS: 'renenutet:access',
  FOXWATCHER_ACCESS: 'foxwatcher:access',
  HERMES_ACCESS: 'hermes:access',

  // Krang - items
  KRANG_ITEMS_READ: 'krang:items:read',
  KRANG_ITEMS_CREATE: 'krang:items:create',
  KRANG_ITEMS_MANAGE: 'krang:items:manage',
  KRANG_ITEMS_DELETE: 'krang:items:delete',

  // Krang — Locations
  KRANG_LOCATIONS_READ: 'krang:locations:read',
  KRANG_LOCATIONS_CREATE: 'krang:locations:create',
  KRANG_LOCATIONS_UPDATE: 'krang:locations:update',
  KRANG_LOCATIONS_DELETE: 'krang:locations:delete',

  // Krang — Towns
  KRANG_TOWNS_READ: 'krang:towns:read',
  KRANG_TOWNS_CREATE: 'krang:towns:create',
  KRANG_TOWNS_UPDATE: 'krang:towns:update',
  KRANG_TOWNS_DELETE: 'krang:towns:delete',

  // Krang — Regions
  KRANG_REGIONS_READ: 'krang:regions:read',
  KRANG_REGIONS_CREATE: 'krang:regions:create',
  KRANG_REGIONS_UPDATE: 'krang:regions:update',
  KRANG_REGIONS_DELETE: 'krang:regions:delete',

  // Krang — Maintenance
  KRANG_MAINTENANCE_RENENUTET: 'krang:maintenance:renenutet',

  // Wan-Shi-Tong — Utilisateurs
  WAN_USERS_READ: 'wan:users:read',
  WAN_USERS_MANAGE: 'wan:users:manage',
  WAN_USERS_SETADMIN: 'wan:users:setadmin',

  // Wan-Shi-Tong — Rôles
  WAN_ROLE_READ: 'wan:role:read',
  WAN_ROLE_CREATE: 'wan:role:create',
  WAN_ROLE_MANAGE: 'wan:role:manage',
  WAN_ROLE_DELETE: 'wan:role:delete',

  // Wan-Shi-Tong — Permissions
  WAN_PERMISSION_READ: 'wan:permission:read',
  WAN_PERMISSION_CREATE: 'wan:permission:create',
  WAN_PERMISSION_MANAGE: 'wan:permission:manage',
  WAN_PERMISSION_DELETE: 'wan:permission:delete',

  // Wan-Shi-Tong — Overrides
  WAN_OVERRIDE_READ: 'wan:override:read',
  WAN_OVERRIDE_MANAGE: 'wan:override:manage',
  WAN_OVERRIDE_DELETE: 'wan:override:delete',

  // Wan-Shi-Tong — Sessions
  WAN_SESSION_READ: 'wan:session:read',
  WAN_SESSION_REVOKE: 'wan:session:revoke',

  // Wan-Shi-Tong — Discord Mapping
  WAN_DISCORD_MAPPING_READ: 'wan:discord-mapping:read',
  WAN_DISCORD_MAPPING_CREATE: 'wan:discord-mapping:create',
  WAN_DISCORD_MAPPING_DELETE: 'wan:discord-mapping:delete',

  // Renenutet — Inventories
  RENENUTET_INVENTORIES_READ: 'renenutet:inventories:read',
  RENENUTET_INVENTORIES_CREATE: 'renenutet:inventories:create',
  RENENUTET_INVENTORIES_UPDATE: 'renenutet:inventories:update',

  // Renenutet — Stocks
  RENENUTET_STOCKS_READ: 'renenutet:stocks:read',
  RENENUTET_STOCKS_CREATE: 'renenutet:stocks:create',
  RENENUTET_STOCKS_INCREMENT: 'renenutet:stocks:increment',
  RENENUTET_STOCKS_DECREMENT: 'renenutet:stocks:decrement',
  RENENUTET_STOCKS_UPDATEMIN: 'renenutet:stocks:updatemin',

  // Renenutet — Production Requests
  RENENUTET_PRODUCTIONREQUEST_READ: 'renenutet:productionrequest:read',
  RENENUTET_PRODUCTIONREQUEST_CREATE: 'renenutet:productionrequest:create',
  RENENUTET_PRODUCTIONREQUEST_UPDATE: 'renenutet:productionrequest:update',
  RENENUTET_PRODUCTIONREQUEST_DELETE: 'renenutet:productionrequest:delete',

  // Renenutet — Item References
  RENENUTET_ITEMREF_CREATE: 'renenutet:itemref:create',
  RENENUTET_ITEMREF_DROP: 'renenutet:itemref:drop',

  // Renenutet — Locations
  RENENUTET_LOCATIONS_SEARCH: 'renenutet:locations:search',

  // Renenutet — Location References
  RENENUTET_LOCATIONREF_CREATE: 'renenutet:locationref:create',
  RENENUTET_LOCATIONREF_DROP: 'renenutet:locationref:drop',
} as const;

export const PermissionSchema = z.enum(PERMISSIONS);
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
