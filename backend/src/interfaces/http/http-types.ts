export interface IHttpRequest {
    readonly body: unknown;
    readonly params: Readonly<Record<string, string | undefined>>;
    readonly authorizationHeader: string | undefined;
}

export interface IHttpResponse {
    readonly status: number;
    readonly body?: unknown;
}

export interface IHttpController {
    handle( req: IHttpRequest): Promise<IHttpResponse>;
}