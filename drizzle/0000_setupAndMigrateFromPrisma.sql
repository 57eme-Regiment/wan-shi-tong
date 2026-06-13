CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "droit";
--> statement-breakpoint
CREATE TYPE "droit"."OverrideEffect" AS ENUM('allow', 'deny');--> statement-breakpoint
CREATE TABLE "auth"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"disabledAt" timestamp (3) with time zone,
	"disabledReason" text,
	"isSuperAdmin" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp (3) NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp (3),
	"refreshTokenExpiresAt" timestamp (3),
	"scope" text,
	"password" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp (3) with time zone NOT NULL,
	"createdAt" timestamp (3) with time zone NOT NULL,
	"updatedAt" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "droit"."role" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "droit"."permission" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"description" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "droit"."rolePermission" (
	"roleId" text NOT NULL,
	"permissionId" text NOT NULL,
	CONSTRAINT "rolePermission_pkey" PRIMARY KEY("roleId","permissionId")
);
--> statement-breakpoint
CREATE TABLE "droit"."discordRoleMapping" (
	"id" text PRIMARY KEY NOT NULL,
	"guildId" text NOT NULL,
	"discordRoleId" text NOT NULL,
	"roleId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "droit"."discordUserRole" (
	"userId" text NOT NULL,
	"guildId" text NOT NULL,
	"discordRoleId" text NOT NULL,
	"syncedAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "discordUserRole_pkey" PRIMARY KEY("userId","guildId","discordRoleId")
);
--> statement-breakpoint
CREATE TABLE "droit"."userAccessSnapshot" (
	"userId" text PRIMARY KEY NOT NULL,
	"appRoles" jsonb NOT NULL,
	"discordRoles" jsonb NOT NULL,
	"permissions" jsonb NOT NULL,
	"computedAt" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "droit"."userPermissionOverride" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"permissionId" text NOT NULL,
	"effect" "droit"."OverrideEffect" NOT NULL,
	"reason" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "droit"."rolePermission" ADD CONSTRAINT "rolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "droit"."role"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "droit"."rolePermission" ADD CONSTRAINT "rolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "droit"."permission"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "droit"."discordRoleMapping" ADD CONSTRAINT "discordRoleMapping_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "droit"."role"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "droit"."userPermissionOverride" ADD CONSTRAINT "userPermissionOverride_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "droit"."permission"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_key" ON "auth"."user" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "user_name_idx" ON "auth"."user" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_key" ON "auth"."session" USING btree ("token" text_ops);--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "auth"."session" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE INDEX "account_accountId_idx" ON "auth"."account" USING gin ("accountId" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "auth"."account" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE INDEX "role_key_idx" ON "droit"."role" USING btree ("key" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "role_key_key" ON "droit"."role" USING btree ("key" text_ops);--> statement-breakpoint
CREATE INDEX "permission_key_idx" ON "droit"."permission" USING btree ("key" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "permission_key_key" ON "droit"."permission" USING btree ("key" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "discordRoleMapping_guildId_discordRoleId_roleId_key" ON "droit"."discordRoleMapping" USING btree ("guildId" text_ops,"discordRoleId" text_ops,"roleId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "userPermissionOverride_userId_permissionId_key" ON "droit"."userPermissionOverride" USING btree ("userId" text_ops,"permissionId" text_ops);
--> statement-breakpoint
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE TRIGGER user_updated_at
  BEFORE UPDATE ON "auth"."user"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();--> statement-breakpoint
CREATE TRIGGER session_updated_at
  BEFORE UPDATE ON "auth"."session"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();--> statement-breakpoint
CREATE TRIGGER account_updated_at
  BEFORE UPDATE ON "auth"."account"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();--> statement-breakpoint