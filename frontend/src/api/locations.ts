import api from './client'
import type { Location } from '../types/location'

// Obtiene las sedes disponibles del gimnasio.
export async function getLocations(): Promise<Location[]> {
  const response = await api.get('/locations')

  return response.data.locations as Location[]
}