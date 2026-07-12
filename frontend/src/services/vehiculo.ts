import { createCrudService } from './crud'
import type { Cliente } from './cliente'
import type { Aseguradora } from './aseguradora'

export interface Vehiculo {
  id: string
  createdAt: string
  updatedAt: string
  cliente: Cliente
  aseguradora: Aseguradora
  placa: string
  marca: string
  modelo: string
  año: number
  color: string
  vinChasis: string | null
}

export interface CreateVehiculoDto {
  clienteId: string
  aseguradoraId: string
  placa: string
  marca: string
  modelo: string
  año: number
  color: string
  vinChasis?: string
}

export type UpdateVehiculoDto = Partial<CreateVehiculoDto>

export const vehiculoService = createCrudService<Vehiculo, CreateVehiculoDto, UpdateVehiculoDto>('vehiculos')
