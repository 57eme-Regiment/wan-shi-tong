import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

export const AdminErrorSchema = z.object({ code: z.string() });

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

export const AdminRoleSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export const CreateRoleSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const UpdateRoleSchema = CreateRoleSchema.partial().extend({
  description: z.string().nullable().optional(),
});

export const RoleParamsSchema = z.object({ id: z.string() });

export const RolePermissionItemSchema = z.object({
  id: z.string(),
  key: z.string(),
  description: z.string().nullable(),
});

export const AddRolePermissionSchema = z.object({ permissionId: z.string() });

export const RolePermissionParamsSchema = z.object({
  roleId: z.string(),
  permissionId: z.string(),
});

export type AdminRole = z.infer<typeof AdminRoleSchema>;
export type CreateRole = z.infer<typeof CreateRoleSchema>;
export type UpdateRole = z.infer<typeof UpdateRoleSchema>;
export type RolePermissionItem = z.infer<typeof RolePermissionItemSchema>;
export type AddRolePermission = z.infer<typeof AddRolePermissionSchema>;

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

export const AdminPermissionSchema = z.object({
  id: z.string(),
  key: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export const CreatePermissionSchema = AdminPermissionSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdatePermissionSchema = CreatePermissionSchema.partial();

export const DeletePermissionSchema = z.object({
  id: z.string(),
});

export type AdminPermission = z.infer<typeof AdminPermissionSchema>;
export type CreatePermission = z.infer<typeof CreatePermissionSchema>;
export type UpdatePermission = z.infer<typeof UpdatePermissionSchema>;
export type DeletePermission = z.infer<typeof DeletePermissionSchema>;

// ---------------------------------------------------------------------------
// Discord Mappings
// ---------------------------------------------------------------------------

export const AdminDiscordMappingSchema = z.object({
  id: z.string(),
  guildId: z.string(),
  discordRoleId: z.string(),
  roleId: z.string(),
  role: z.object({ key: z.string(), name: z.string() }),
});

export const CreateDiscordMappingSchema = z.object({
  guildId: z.string().min(1),
  discordRoleId: z.string().min(1),
  roleKey: z.string().min(1),
});

export const MappingParamsSchema = z.object({ id: z.string().uuid() });

export type AdminDiscordMapping = z.infer<typeof AdminDiscordMappingSchema>;
export type CreateDiscordMapping = z.infer<typeof CreateDiscordMappingSchema>;

// ---------------------------------------------------------------------------
// Overrides
// ---------------------------------------------------------------------------

export const AdminOverrideSchema = z.object({
  id: z.string(),
  userId: z.string(),
  permissionId: z.string(),
  effect: z.enum(['allow', 'deny']),
  reason: z.string().nullable(),
  createdAt: z.coerce.date(),
  permission: z.object({ key: z.string() }),
});

export const CreateOverrideSchema = z.object({
  permissionKey: z.string().min(1),
  effect: z.enum(['allow', 'deny']),
  reason: z.string().optional(),
});

export const OverrideUserParamsSchema = z.object({ userId: z.string() });
export const OverrideDeleteParamsSchema = z.object({
  userId: z.string(),
  permissionKey: z.string(),
});

export type AdminOverride = z.infer<typeof AdminOverrideSchema>;
export type CreateOverride = z.infer<typeof CreateOverrideSchema>;

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export const AdminSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
});

export const SessionParamsSchema = z.object({ sessionId: z.string() });

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const AdminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.url().nullish(),
  disabledAt: z.date().nullish(),
  disabledReason: z.string().nullish(),
  isSuperAdmin: z.boolean().default(false),
  sessions: AdminSessionSchema.array().nullish(),
});
export const AdminUserParamsSchema = z.object({ userId: z.string() });
export const DisableUserSchema = z.object({ reason: z.string().optional() });

export type AdminSession = z.infer<typeof AdminSessionSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
