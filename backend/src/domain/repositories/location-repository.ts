export interface ILocationRepository {
    exists(idLocation: number): Promise<boolean>;
}