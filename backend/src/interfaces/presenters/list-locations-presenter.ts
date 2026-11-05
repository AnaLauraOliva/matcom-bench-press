import type {
    IListLocationsOutputBoundary,
    IListLocationsResponse,
} from "../../application/use-cases/list-locations/list-locations-boundaries.js";
import { ok } from "../http/http-responses.js";
import { BasePresenter } from "./base-presenter.js";
export class ListLocationsPresenter
    extends BasePresenter
    implements IListLocationsOutputBoundary
{
    presentSuccess(response: IListLocationsResponse): void {
        this.respond(ok({ locations: response.locations }));
    }
}
