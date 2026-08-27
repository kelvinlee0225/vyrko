export interface LineaConMontos {
  cantidad: number
  precioUnitario: number
  itbis: number
  descuento?: number | null
}

function redondear(monto: number) {
  return Math.round(monto * 100) / 100
}

/**
 * Mirrors the backend's common/totales/totales.util.ts so a draft's totals match
 * what the server computes once it is saved.
 *
 * A global discount reduces the taxable base rather than the final amount, per
 * DGII: "Descuentos o Recargos ... aumentan o disminuyen la base del impuesto"
 * (Formato Comprobante Fiscal Electronico V1.0, pg. 48). Each line's base — and
 * therefore its ITBIS — shrinks by the same factor, which is what prorating the
 * discount by MontoItem share amounts to (Informe Tecnico e-CF v1.0, pg. 28).
 */
export function calcularTotales(lineas: LineaConMontos[], descuentoGlobal: number | string | null = 0) {
  const subtotal = redondear(
    lineas.reduce((sum, l) => sum + l.cantidad * l.precioUnitario - (l.descuento ?? 0), 0),
  )
  const descuento = typeof descuentoGlobal === 'string' ? parseFloat(descuentoGlobal) || 0 : (descuentoGlobal ?? 0)
  // Clamped at 0 when the discount swallows the whole subtotal; the backend
  // rejects that outright when the invoice is filed as an e-CF.
  const factor = subtotal <= 0 || descuento >= subtotal ? 0 : descuento <= 0 ? 1 : (subtotal - descuento) / subtotal
  const itbis = redondear(lineas.reduce((sum, l) => sum + l.itbis * factor, 0))

  return { subtotal, itbis, descuentoGlobal: descuento, total: redondear(subtotal - descuento + itbis) }
}
