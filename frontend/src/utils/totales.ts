export interface LineaConMontos {
  cantidad: number
  precioUnitario: number
  itbis: number
  descuento?: number | null
}

export function calcularTotales(lineas: LineaConMontos[], descuentoGlobal: number | string | null = 0) {
  const subtotal = lineas.reduce((sum, l) => sum + l.cantidad * l.precioUnitario - (l.descuento ?? 0), 0)
  const itbis = lineas.reduce((sum, l) => sum + l.itbis, 0)
  const descuento = typeof descuentoGlobal === 'string' ? parseFloat(descuentoGlobal) : (descuentoGlobal ?? 0)
  const total = subtotal + itbis - descuento
  return { subtotal, itbis, descuentoGlobal: descuento, total }
}
