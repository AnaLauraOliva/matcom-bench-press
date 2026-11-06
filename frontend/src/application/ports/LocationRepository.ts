import type { Location } from '../../domain/entities/Location'

export interface LocationRepository {
  getAll(): Promise<Location[]>
}