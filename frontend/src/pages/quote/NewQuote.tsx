import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/Button'
import { Field, fieldClass, FormError } from '../components/forms/fields'
import { VehiculoFields } from '../components/forms/VehiculoFields'
import { LineItemsEditor } from '../components/forms/LineItemsEditor'
import { SearchableSelect } from '../components/forms/SearchableSelect'
import { IconCustomers, IconCar, IconPlus } from '../components/icons'
import { useDataStore, generateCotizacionNumero } from '../store/dataStore'
import { calcularTotales, type Cotizacion, type LineaItem, type Vehiculo } from '../data/mockData'
import { formatCurrency } from '../utils/format'

const EMPTY_VEHICULO: Vehiculo = { marca: '', modelo: '', anio: new Date().getFullYear(), placa: '', color: '', vinChasis: '', aseguradora: '—' }

const schema = z.object({
  clienteId: z.string().min(1, 'Selecciona un cliente.'),
  fechaValidez: z.string().min(1, 'Selecciona la fecha de validez.'),
  vehiculoPlaca: z.string().min(2, 'Ingresa la placa del vehículo.'),
})

export function NewQuote() {
  const navigate = useNavigate()
  const clientes = useDataStore((s) => s.clientes)
  const addCotizacion = useDataStore((s) => s.addCotizacion)

  const [clienteId, setClienteId] = useState('')
  const [vehiculo, setVehiculo] = useState<Vehiculo>(EMPTY_VEHICULO)
  const [fechaValidez, setFechaValidez] = useState('')
  const [descuentoGlobal, setDescuentoGlobal] = useState('0')
  const [notas, setNotas] = useState('')
  const [lineas, setLineas] = useState<LineaItem[]>([
    { descripcion: '', tipo: 'servicio', cantidad: 1, precioUnitario: 0, itbis: 0 },
  ])
  const [error, setError] = useState<string | null>(null)

  const clienteSeleccionado = clientes.find((c) => c.cedulaRnc === clienteId)
  const totales = calcularTotales(lineas, parseFloat(descuentoGlobal) || 0)

  function handleClienteChange(cedulaRnc: string) {
    setClienteId(cedulaRnc)
    const cliente = clientes.find((c) => c.cedulaRnc === cedulaRnc)
    const primerVehiculo = cliente?.vehiculos[0]
    setVehiculo(
      primerVehiculo
        ? { ...primerVehiculo, vinChasis: '', aseguradora: cliente?.esAseguradora ? cliente.nombre : '—' }
        : EMPTY_VEHICULO,
    )
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = schema.safeParse({ clienteId, fechaValidez, vehiculoPlaca: vehiculo.placa })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    if (lineas.some((l) => !l.descripcion.trim())) {
      setError('Completa la descripción de cada línea.')
      return
    }
    if (!clienteSeleccionado) {
      setError('Selecciona un cliente.')
      return
    }

    const nueva: Cotizacion = {
      numero: generateCotizacionNumero(),
      estado: 'borrador',
      createdAt: new Date().toISOString().slice(0, 10),
      fechaValidez,
      cliente: {
        nombre: clienteSeleccionado.nombre,
        tipo: clienteSeleccionado.tipo,
        cedulaRnc: clienteSeleccionado.cedulaRnc,
        telefono: clienteSeleccionado.telefono,
        correo: clienteSeleccionado.correo,
        esAseguradora: clienteSeleccionado.esAseguradora,
      },
      vehiculo,
      lineas,
      descuentoGlobal: parseFloat(descuentoGlobal) || 0,
      notas,
    }
    addCotizacion(nueva)
    navigate(`/cotizaciones/${nueva.numero}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Link to="/cotizaciones" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
        ← Volver a cotizaciones
      </Link>

      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl">Nueva cotización</h1>
          <p className="mt-1 text-[13.5px] text-muted">Completa los datos para crear una nueva cotización.</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/cotizaciones')}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" icon={<IconPlus size={16} />}>
            Crear cotización
          </Button>
        </div>
      </div>

      <FormError message={error} />

      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
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
                onChange={handleClienteChange}
                placeholder="Buscar cliente…"
                options={clientes.map((c) => ({ value: c.cedulaRnc, label: c.nombre, sublabel: c.cedulaRnc }))}
              />
            </Field>
            <Field label="Válida hasta">
              <input
                type="date"
                value={fechaValidez}
                onChange={(e) => setFechaValidez(e.target.value)}
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
            Vehículo
          </div>
          <VehiculoFields vehiculo={vehiculo} onChange={setVehiculo} />
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
              <span>ITBIS (18%)</span>
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
