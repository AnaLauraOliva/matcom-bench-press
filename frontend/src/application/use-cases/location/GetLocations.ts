import type { LocationRepository } from '../../ports/LocationRepository'
import type { Location } from '../../../domain/entities/Location'

export class GetLocations {
  private readonly locationRepository: LocationRepository

  constructor(locationRepository: LocationRepository) {
    this.locationRepository = locationRepository
  }

  execute(): Promise<Location[]> {
    return this.locationRepository.getAll()
  }
}