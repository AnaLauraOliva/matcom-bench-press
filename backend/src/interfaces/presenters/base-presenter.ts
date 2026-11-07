import type { IFailureOutputBoundary } from "../../application/boundaries/failure-output-boundary.js";
import type { ApplicationError } from "../../application/errors/application-errors.js";
import { fromApplicationError } from "../http/http-responses.js";
import type { IHttpResponse } from "../http/http-types.js";
// Un presenter recibe el resultado del caso de uso y lo convierte en un ViewModel (HttpResponse).
// Esta clase base ya sabe presentar los fallos; cada hijo presenta su propio éxito.
export abstract class BasePresenter implements IFailureOutputBoundary {
    private viewModel: IHttpResponse | undefined;
    presentFailure(error: ApplicationError): void {
        this.respond(fromApplicationError(error));
    }
    getViewModel(): IHttpResponse {
        if (!this.viewModel) {
            throw new Error(
                "El caso de uso terminó sin presentar ningún resultado.",
            );
        }
        return this.viewModel;
    }
    protected respond(viewModel: IHttpResponse): void {
        this.viewModel = viewModel;
    }
}
