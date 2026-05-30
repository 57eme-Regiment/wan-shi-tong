import { createAuthClient } from "./auth-client";
import { createAccessClient, type AccessClient } from "./access-client";

type AuthConfig = {
  baseUrl: string;
  accessClient: AccessClient;
  authClient: ReturnType<typeof createAuthClient>;
};

let _config: AuthConfig | null = null;

/**
 * Initialise le client d'authentification avec l'URL de base du service.
 * Doit être appelé une seule fois au démarrage de l'application (ex: main.tsx).
 *
 * @example
 * configureAuth(import.meta.env.VITE_AUTH_SERVICE_URL)
 */
export function configureAuth(baseUrl: string): void {
  _config = {
    baseUrl,
    accessClient: createAccessClient(baseUrl),
    authClient: createAuthClient({ baseURL: baseUrl }),
  };
}

/** Retourne la configuration initialisée. Lance une erreur si `configureAuth` n'a pas été appelé. */
export function getConfig(): AuthConfig {
  if (!_config) {
    throw new Error(
      "[auth-browser] configureAuth() must be called before using hooks or clients.",
    );
  }
  return _config;
}
