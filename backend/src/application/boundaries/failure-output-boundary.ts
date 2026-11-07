import type { ApplicationError } from "../errors/application-errors.js";
export interface IFailureOutputBoundary {
    presentFailure(error: ApplicationError): void;
}