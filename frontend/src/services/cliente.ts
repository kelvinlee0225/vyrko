import { createCrudService } from './crud'

export interface Cliente {
  id: string
  createdAt: string
  updatedAt: string
  nombreRazonSocial: string
  tipoCliente: string
  esAseguradora: boolean
  cedulaRnc: string | null
  telefono: string
  correo: string | null
  direccion: string | null
  limiteCredito: string | null
  diasCredito: number | null
}

export interface CreateClienteDto {
  nombreRazonSocial: string
  tipoCliente: string
  esAseguradora?: boolean
  cedulaRnc?: string
  telefono: string
  correo?: string
  direccion?: string
  limiteCredito?: string
  diasCredito?: number
}

export type UpdateClienteDto = Partial<CreateClienteDto>

export const clienteService = createCrudService<Cliente, CreateClienteDto, UpdateClienteDto>('clientes')
