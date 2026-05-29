import { createAuthClient } from "better-auth/react";

export function createFoxholeAuthClient(baseUrl: string) {
  return createAuthClient({ baseURL: baseUrl });
}
