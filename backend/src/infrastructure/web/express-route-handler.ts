import type { ParamsDictionary, RequestHandler, Response } from "express-serve-static-core";
import type {
    IHttpController,
    IHttpResponse,
} from "../../interfaces/http/http-types.js";

// Escribe un ViewModel (HttpResponse) como respuesta real de Express.
export function sendHttpResponse(res: Response, response: IHttpResponse): void {
    res.status(response.status);
    if (response.body === undefined) {
        res.end();
    } else {
        res.json(response.body);
    }
}

// Express 5 puede devolver arrays por parámetros capturados repetidos;
// el contrato del controlador solo acepta strings.
function normalizeParams(
    source: ParamsDictionary
): Readonly<Record<string, string | undefined>> {
    const normalized: Record<string, string | undefined> = {};
    for (const [key, value] of Object.entries(source)) {
        normalized[key] = Array.isArray(value) ? value[0] : value;
    }
    return normalized;
}

// Conecta un controlador (que no conoce Express) con una ruta de Express.
export function toExpressHandler(controller: IHttpController): RequestHandler {
    return async (req, res) => {
        const response = await controller.handle({
            body: req.body,
            params: normalizeParams(req.params),
            authorizationHeader: req.headers.authorization,
        });
        sendHttpResponse(res, response);
    };
}
