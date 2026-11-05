import type { IListLocationsInputBoundary } from "../../application/use-cases/list-locations/list-locations-boundaries.js";
import type { IHttpController, IHttpResponse } from "../http/http-types.js";
import { ListLocationsPresenter } from "../presenters/list-locations-presenter.js";
// Ruta pública: no necesita sesión, porque el formulario de registro la usa antes de tener cuenta.
export class ListLocationsController implements IHttpController {
    constructor(private readonly listLocations: IListLocationsInputBoundary) {}
    async handle(): Promise<IHttpResponse> {
        const presenter = new ListLocationsPresenter();
        await this.listLocations.execute(presenter);
        return presenter.getViewModel();
    }
}
