/**
 * Enregistre une route Fastify à partir d'un endpoint de contrat ts-rest.
 * Mappe automatiquement `method`, `path`, `body`, `pathParams` et `responses`.
 *
 * @example
 * declareRoute(server, inventoryContract.getAll, ctrl.getAll.bind(ctrl));
 */
export function declareRoute(server, contract, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
handler, options) {
    const method = contract.method.toLowerCase();
    const schema = { response: contract.responses };
    if (contract.body && typeof contract.body !== 'symbol')
        schema.body = contract.body;
    if (contract.pathParams)
        schema.params = contract.pathParams;
    if (contract.summary)
        schema.summary = contract.summary;
    if (contract.description)
        schema.description = contract.description;
    if (contract.metadata?.tags)
        schema.tags = contract.metadata.tags;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server[method](contract.path, { ...options, schema }, handler);
}
