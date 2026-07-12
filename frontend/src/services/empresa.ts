import { api } from '../lib/api'

export interface Empresa {
  id: string
  createdAt: string
  updatedAt: string
  nombre: string
  rnc: string
  direccion: string
  telefono: string
  correo: string
}

export interface UpsertEmpresaDto {
  nombre: string
  rnc: string
  direccion: string
  telefono: string
  correo: string
}

export const empresaService = {
  /** Throws (404) if the company profile hasn't been configured yet. */
  find: () => api.get<Empresa>('/empresa').then((r) => r.data),
  upsert: (dto: UpsertEmpresaDto) => api.put<Empresa>('/empresa', dto).then((r) => r.data),
}
