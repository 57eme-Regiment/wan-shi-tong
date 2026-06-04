import { z } from 'zod';
export declare const HttpMethod: {
    readonly GET: "GET";
    readonly POST: "POST";
    readonly PUT: "PUT";
    readonly DELETE: "DELETE";
    readonly PATCH: "PATCH";
};
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];
export declare const HttpMethodSchema: z.ZodEnum<{
    GET: "GET";
    POST: "POST";
    PUT: "PUT";
    DELETE: "DELETE";
    PATCH: "PATCH";
}>;
//# sourceMappingURL=http-method.d.ts.map