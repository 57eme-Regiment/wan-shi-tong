ALTER TABLE "auth"."session" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "auth"."account" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "auth"."verification" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();