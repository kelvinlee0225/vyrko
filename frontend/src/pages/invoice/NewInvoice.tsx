import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Field, fieldClass, FormError } from '../../components/forms/fields'
import { SearchableSelect } from '../../components/forms/SearchableSelect'
import { VehiculoPicker } from '../../components/forms/VehiculoPicker'
import { LineItemsEditor } from '../../components/forms/LineItemsEditor'
import { emptyLinea, type LineaItemDraft } from '../../components/forms/lineaItemDraft'
import { IconCustomers, IconCar, IconShield, IconPlus } from '../../components/ui/icons'
import { useApiList } from '../../hooks/useApiList'
import { clienteService } from '../../services/cliente'
import { vehiculoService } from '../../services/vehiculo'
import { cotizacionService, type Cotizacion } from '../../services/cotizacion'
import { ordenTrabajoService } from '../../services/ordenTrabajo'
import { facturaService, type CreateFacturaLineaDto } from '../../services/factura'
import { calcularTotales } from '../../utils/totales'
import { formatCurrency, formatDate } from '../../utils/format'

const schema = z.object({
  clienteId: z.string().min(1, 'Selecciona un cliente.'),
})

function lineaToDraft(linea: Cotizacion['lineas'][number]): LineaItemDraft {
  return {
    servicioId: linea.servicio.id,
    piezaId: linea.pieza?.id ?? null,
    descripcion: linea.descripcion,
    cantidad: parseFloat(linea.cantidad),
    precioUnitario: parseFloat(linea.precioUnitario),
    itbis: parseFloat(linea.itbis),
    descuento: linea.descuento ? parseFloat(linea.descuento) : 0,
  }
}

export function NewInvoice() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: clientes } = useApiList(clienteService.list)
  const { data: vehiculos, reload: reloadVehiculos } = useApiList(vehiculoService.list)
  const { data: cotizaciones } = useApiList(cotizacionService.list)
  const { data: ordenesTrabajo } = useApiList(ordenTrabajoService.list)

  const [clienteId, setClienteId] = useState('')
  const [vehiculoId, setVehiculoId] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')
  const [cotizacionId, setCotizacionId] = useState('')
  const [ordenTrabajoId, setOrdenTrabajoId] = useState('')
  const [descuentoGlobal, setDescuentoGlobal] = useState('0')
  const [notas, setNotas] = useState('')
  const [lineas, setLineas] = useState<LineaItemDraft[]>([emptyLinea()])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [prefillAplicado, setPrefillAplicado] = useState(false)

  const vehiculosCliente = vehiculos.filter((v) => v.cliente.id === clienteId)
  const totales = calcularTotales(lineas, descuentoGlobal)

  const cotizacionSeleccionada = cotizaciones.find((c) => c.id === cotizacionId)
  const avisoCotizacion =
    cotizacionSeleccionada?.estado === 'borrador'
      ? `La cotización ${cotizacionSeleccionada.numero} sigue en borrador: nunca fue entregada al cliente. Puedes facturar de todas formas, pero verifica que el cliente haya aprobado el trabajo.`
      : cotizacionSeleccionada?.estado === 'vencida'
        ? `La cotización ${cotizacionSeleccionada.numero} está vencida desde el ${formatDate(cotizacionSeleccionada.fechaValidez)}. Puedes facturar de todas formas, pero confirma que los precios sigan vigentes.`
        : null

  function aplicarCotizacion(cotizacion: Cotizacion) {
    setCotizacionId(cotizacion.id)
    setClienteId(cotizacion.cliente.id)
    setVehiculoId(cotizacion.vehiculo.id)
    setDescuentoGlobal(cotizacion.descuentoGlobal ?? '0')
    setLineas(cotizacion.lineas.map(lineaToDraft))
  }

  function handleCotizacionChange(nuevaCotizacionId: string) {
    setCotizacionId(nuevaCotizacionId)
    const cotizacion = cotizaciones.find((c) => c.id === nuevaCotizacionId)
    if (cotizacion) {
      aplicarCotizacion(cotizacion)
    }
  }

  function handleOrdenChange(nuevaOrdenId: string) {
    setOrdenTrabajoId(nuevaOrdenId)
    const orden = ordenesTrabajo.find((o) => o.id === nuevaOrdenId)
    if (!orden) return
    // La cotización de la orden trae todo (cliente, vehículo, líneas); sin ella, al menos cliente y vehículo.
    const cotizacion = orden.cotizacion ? cotizaciones.find((c) => c.id === orden.cotizacion!.id) : undefined
    if (cotizacion) {
      aplicarCotizacion(cotizacion)
    } else {
      setClienteId(orden.vehiculo.cliente.id)
      setVehiculoId(orden.vehiculo.id)
    }
  }

  // Prefill vía query params (?cotizacion= / ?orden=) para los atajos "Facturar".
  // Se aplica durante el render (con guard) en cuanto llegan los datos, en lugar
  // de en un efecto — patrón de "derived state" recomendado por React.
  if (!prefillAplicado && cotizaciones.length > 0) {
    const cotizacionParam = searchParams.get('cotizacion')
    const ordenParam = searchParams.get('orden')
    if (cotizacionParam) {
      setPrefillAplicado(true)
      handleCotizacionChange(cotizacionParam)
    } else if (ordenParam) {
      if (ordenesTrabajo.length > 0) {
        setPrefillAplicado(true)
        handleOrdenChange(ordenParam)
      }
    } else {
      setPrefillAplicado(true)
    }
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const parsed = schema.safeParse({ clienteId })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    if (lineas.some((l) => !l.servicioId)) {
      setError('Selecciona un servicio para cada línea.')
      return
    }

    setSubmitting(true)
    try {
      const lineasDto: CreateFacturaLineaDto[] = lineas.map((l) => ({
        servicioId: l.servicioId,
        piezaId: l.piezaId ?? undefined,
        descripcion: l.descripcion,
        cantidad: String(l.cantidad),
        precioUnitario: String(l.precioUnitario),
        itbis: String(l.itbis),
        descuento: l.descuento ? String(l.descuento) : undefined,
      }))
      const nueva = await facturaService.create({
        clienteId,
        vehiculoId: vehiculoId || undefined,
        cotizacionId: cotizacionId || undefined,
        ordenTrabajoId: ordenTrabajoId || undefined,
        fechaEmision: new Date().toISOString().slice(0, 10),
        fechaVencimiento: fechaVencimiento || undefined,
        descuentoGlobal: descuentoGlobal || undefined,
        notas: notas || undefined,
        lineas: lineasDto,
      })
      navigate(`/facturacion/${nueva.id}`)
    } catch {
      setError('No se pudo crear la factura. Verifica los datos e intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Link to="/facturacion" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
        ← Volver a facturas
      </Link>

      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl">Nueva factura</h1>
          <p className="mt-1 text-[13.5px] text-muted">Completa los datos para crear una nueva factura.</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/facturacion')}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" icon={<IconPlus size={16} />} disabled={submitting}>
            {submitting ? 'Creando…' : 'Crear factura'}
          </Button>
        </div>
      </div>

      <FormError message={error} />

      {avisoCotizacion && (
        <p className="rounded-md border border-warning bg-warning-soft px-4 py-3 text-[12.5px] leading-[1.5] text-warning">
          {avisoCotizacion}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-1">
        <div className="min-w-0 rounded-lg border border-line bg-surface p-6">
          <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-ink">
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-sm bg-surface-alt text-brand">
              <IconShield size={15} />
            </span>
            Origen (opcional)
          </div>
          <div className="flex flex-col gap-3">
            <Field label="Cotización de origen">
              <select value={cotizacionId} onChange={(e) => handleCotizacionChange(e.target.value)} className={fieldClass}>
                <option value="">Ninguna — factura desde cero</option>
                {cotizaciones.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.numero} — {c.cliente.nombreRazonSocial}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Orden de trabajo">
              <select value={ordenTrabajoId} onChange={(e) => handleOrdenChange(e.target.value)} className={fieldClass}>
                <option value="">Ninguna</option>
                {ordenesTrabajo.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.vehiculo.placa} — {o.vehiculo.marca} {o.vehiculo.modelo}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="min-w-0 rounded-lg border border-line bg-surface p-6">
          <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-ink">
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-sm bg-surface-alt text-brand">
              <IconCustomers size={15} />
            </span>
            Cliente
          </div>
          <div className="flex flex-col gap-3">
            <Field label="Cliente">
              <SearchableSelect
                value={clienteId}
                onChange={(value) => {
                  setClienteId(value)
                  setVehiculoId('')
                }}
                placeholder="Buscar cliente…"
                options={clientes.map((c) => ({
                  value: c.id,
                  label: c.nombreRazonSocial,
                  sublabel: c.cedulaRnc ?? undefined,
                }))}
              />
            </Field>
            <Field label="Vencimiento (opcional)">
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className={fieldClass}
              />
            </Field>
          </div>
        </div>

        <div className="min-w-0 rounded-lg border border-line bg-surface p-6">
          <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-ink">
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-sm bg-surface-alt text-brand">
              <IconCar size={16} />
            </span>
            Vehículo (opcional)
          </div>
          {clienteId ? (
            <VehiculoPicker
              vehiculos={vehiculosCliente}
              value={vehiculoId}
              onChange={setVehiculoId}
              clienteId={clienteId}
              onVehiculoCreated={reloadVehiculos}
            />
          ) : (
            <p className="text-[12.5px] text-muted">Selecciona un cliente primero.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[2.2fr_1fr] items-start gap-6 max-[1100px]:grid-cols-1">
        <div className="min-w-0 rounded-lg border border-line bg-surface p-6">
          <p className="mb-3 text-[12.5px] font-medium text-muted">Líneas</p>
          <LineItemsEditor lineas={lineas} onChange={setLineas} />
        </div>

        <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-line bg-surface p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[13px] text-ink">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{formatCurrency(totales.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-ink">
              <span>ITBIS</span>
              <span className="font-mono tabular-nums">{formatCurrency(totales.itbis)}</span>
            </div>
            <Field label="Descuento global">
              <input
                type="number"
                min="0"
                step="0.01"
                value={descuentoGlobal}
                onChange={(e) => setDescuentoGlobal(e.target.value)}
                className={fieldClass}
              />
            </Field>
            <div className="mt-2 flex items-center justify-between border-t border-line pt-4 text-[17px] font-bold text-brand">
              <span>Total</span>
              <span className="font-mono tabular-nums">{formatCurrency(totales.total)}</span>
            </div>
          </div>

          <Field label="Notas (opcional)">
            <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={3} className={`${fieldClass} resize-none`} />
          </Field>
        </div>
      </div>
    </form>
  )
}
