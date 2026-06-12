-- Drop FK constraints referencing columns being altered
ALTER TABLE "auth"."session" DROP CONSTRAINT "session_userId_fkey";--> statement-breakpoint
ALTER TABLE "auth"."account" DROP CONSTRAINT "account_userId_fkey";--> statement-breakpoint
ALTER TABLE "droit"."rolePermission" DROP CONSTRAINT "rolePermission_roleId_fkey";--> statement-breakpoint
ALTER TABLE "droit"."rolePermission" DROP CONSTRAINT "rolePermission_permissionId_fkey";--> statement-breakpoint
ALTER TABLE "droit"."discordRoleMapping" DROP CONSTRAINT "discordRoleMapping_roleId_fkey";--> statement-breakpoint
ALTER TABLE "droit"."userPermissionOverride" DROP CONSTRAINT "userPermissionOverride_permissionId_fkey";--> statement-breakpoint
-- Drop indexes that reference columns being altered
DROP INDEX IF EXISTS "auth"."session_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "auth"."account_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "droit"."discordRoleMapping_guildId_discordRoleId_roleId_key";--> statement-breakpoint
DROP INDEX IF EXISTS "droit"."userPermissionOverride_userId_permissionId_key";--> statement-breakpoint
-- Alter column types
ALTER TABLE "auth"."user" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "auth"."user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "auth"."session" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "auth"."session" ALTER COLUMN "userId" SET DATA TYPE uuid USING "userId"::uuid;--> statement-breakpoint
ALTER TABLE "auth"."account" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "auth"."account" ALTER COLUMN "userId" SET DATA TYPE uuid USING "userId"::uuid;--> statement-breakpoint
ALTER TABLE "auth"."verification" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."role" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."role" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "droit"."permission" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."permission" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "droit"."rolePermission" ALTER COLUMN "roleId" SET DATA TYPE uuid USING "roleId"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."rolePermission" ALTER COLUMN "permissionId" SET DATA TYPE uuid USING "permissionId"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."discordRoleMapping" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."discordRoleMapping" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "droit"."discordRoleMapping" ALTER COLUMN "roleId" SET DATA TYPE uuid USING "roleId"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."discordUserRole" ALTER COLUMN "userId" SET DATA TYPE uuid USING "userId"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."userAccessSnapshot" ALTER COLUMN "userId" SET DATA TYPE uuid USING "userId"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."userPermissionOverride" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."userPermissionOverride" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "droit"."userPermissionOverride" ALTER COLUMN "userId" SET DATA TYPE uuid USING "userId"::uuid;--> statement-breakpoint
ALTER TABLE "droit"."userPermissionOverride" ALTER COLUMN "permissionId" SET DATA TYPE uuid USING "permissionId"::uuid;--> statement-breakpoint
-- Recreate FK constraints
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "droit"."rolePermission" ADD CONSTRAINT "rolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "droit"."role"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "droit"."rolePermission" ADD CONSTRAINT "rolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "droit"."permission"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "droit"."discordRoleMapping" ADD CONSTRAINT "discordRoleMapping_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "droit"."role"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "droit"."userPermissionOverride" ADD CONSTRAINT "userPermissionOverride_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "droit"."permission"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
-- Recreate indexes
CREATE INDEX "session_userId_idx" ON "auth"."session" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "auth"."account" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "discordRoleMapping_guildId_discordRoleId_roleId_key" ON "droit"."discordRoleMapping" USING btree ("guildId" text_ops,"discordRoleId" text_ops,"roleId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "userPermissionOverride_userId_permissionId_key" ON "droit"."userPermissionOverride" USING btree ("userId" uuid_ops,"permissionId" uuid_ops);
