import { defaultShouldDehydrateQuery, environmentManager, QueryClient, } from '@tanstack/react-query';
import { HttpError } from './http-error.js';
const makeQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: (failureCount, error) => {
                if (error instanceof HttpError && (error.status === 401 || error.status === 403)) {
                    return false;
                }
                return failureCount < 2;
            },
        },
        dehydrate: {
            shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
            shouldRedactErrors: () => false,
        },
    },
});
let browserQueryClient;
/** Retourne un QueryClient singleton côté navigateur, ou en crée un nouveau côté serveur. */
export const getQueryClient = () => {
    if (environmentManager.isServer()) {
        return makeQueryClient();
    }
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
};
