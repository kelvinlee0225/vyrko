import { api } from '../lib/api'

/**
 * Factory for the uniform create/list/get/update/remove pattern shared by every
 * simple backend resource (no nested sub-routes). Resources with extra endpoints
 * (líneas, consumos, pagos, etc.) get their own bespoke service file instead.
 */
export function createCrudService<Entity, CreateDto, UpdateDto = Partial<CreateDto>>(resource: string) {
  return {
    list: () => api.get<Entity[]>(`/${resource}`).then((r) => r.data),
    get: (id: string) => api.get<Entity>(`/${resource}/${id}`).then((r) => r.data),
    create: (dto: CreateDto) => api.post<Entity>(`/${resource}`, dto).then((r) => r.data),
    update: (id: string, dto: UpdateDto) => api.patch<Entity>(`/${resource}/${id}`, dto).then((r) => r.data),
    remove: (id: string) => api.delete<void>(`/${resource}/${id}`).then((r) => r.data),
  }
}
