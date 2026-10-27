export interface ILocationRepository {
    exists(locationName: string): Promise<boolean>;
}