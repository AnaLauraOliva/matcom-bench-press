export interface ILocationRecord {
    readonly id: number;
    readonly name: string;
    readonly address: string;
}
export interface ILocationDataSource {
    existsById(idLocation: number): Promise<boolean>;
    // Ordenadas alfabéticamente por nombre.
    findAll(): Promise<ILocationRecord[]>;
}
