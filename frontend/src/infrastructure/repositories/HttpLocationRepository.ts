import apiClient from '../http/apiClient'

import type { LocationRepository } from '../../application/ports/LocationRepository'
import type { Location } from '../../domain/entities/Location'

export class HttpLocationRepository implements LocationRepository {
  async getAll(): Promise<Location[]> {
    const response = await apiClient.get('/locations')

    return response.data.locations as Location[]
  }
}