-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateIndex
CREATE INDEX "account_accountId_idx" ON "auth"."account" USING GIN ("accountId" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "user_name_idx" ON "auth"."user" USING GIN ("name" gin_trgm_ops);
