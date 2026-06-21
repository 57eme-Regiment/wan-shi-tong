import { createAuthClient } from './auth-client';
import { createAccessClient, type AccessClient } from './access-client';

type AuthConfig = {
  baseUrl: string;
  accessClient: AccessClient;
  authClient: ReturnType<typeof createAuthClient>;
};

let _config: AuthConfig | null = null;

export function configureAuth(baseUrl: string): void {
  _config = {
    baseUrl,
    accessClient: createAccessClient(baseUrl),
    authClient: createAuthClient({ baseURL: baseUrl }),
  };
}

export function getConfig(): AuthConfig {
  if (!_config) {
    throw new Error(
      '[auth-browser] configureAuth() must be called before using hooks or clients.',
    );
  }
  return _config;
}
