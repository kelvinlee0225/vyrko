export interface LineaItemDraft {
  servicioId: string
  piezaId: string | null
  descripcion: string
  cantidad: number
  precioUnitario: number
  itbis: number
  descuento: number
}

export function emptyLinea(): LineaItemDraft {
  return { servicioId: '', piezaId: null, descripcion: '', cantidad: 1, precioUnitario: 0, itbis: 0, descuento: 0 }
}
