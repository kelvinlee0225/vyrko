import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Modal } from '../Modal'
import { Button } from '../Button'
import { Field, fieldClass, FormError } from './fields'
import { VehiculoFields } from './VehiculoFields'
import { SearchableSelect } from './SearchableSelect'
import { IconPlus, IconTrash } from '../icons'
import { useDataStore, generateOrdenTrabajoNumero } from '../../store/dataStore'
import { tecnicos, type ConsumoMaterial, type OrdenTrabajo, type Vehiculo } from '../../data/mockData'

const EMPTY_VEHICULO: Vehiculo = { marca: '', modelo: '', anio: new Date().getFullYear(), placa: '', color: '', vinChasis: '', aseguradora: '—' }

const schema = z.object({
  clienteId: z.string().min(1, 'Selecciona un cliente.'),
  tecnicoNombre: z.string().min(1, 'Selecciona un técnico.'),
  fechaEntrada: z.string().min(1, 'Selecciona la fecha de entrada.'),
  vehiculoPlaca: z.string().min(2, 'Ingresa la placa del vehículo.'),
})

export function NewWorkOrderModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const clientes = useDataStore((s) => s.clientes)
  const cotizaciones = useDataStore((s) => s.cotizaciones)
  const addOrdenTrabajo = useDataStore((s) => s.addOrdenTrabajo)

  const [clienteId, setClienteId] = useState('')
  const [vehiculo, setVehiculo] = useState<Vehiculo>(EMPTY_VEHICULO)
  const [tecnicoNombre, setTecnicoNombre] = useState('')
  const [fechaEntrada, setFechaEntrada] = useState(() => new Date().toISOString().slice(0, 10))
  const [fechaEntregaEstimada, setFechaEntregaEstimada] = useState('')
  const [cotizacionRef, setCotizacionRef] = useState('')
  const [descripcionTrabajo, setDescripcionTrabajo] = useState('')
  const [consumos, setConsumos] = useState<ConsumoMaterial[]>([])
  const [error, setError] = useState<string | null>(null)

  const clienteSeleccionado = clientes.find((c) => c.cedulaRnc === clienteId)

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

  function updateConsumo(index: number, patch: Partial<ConsumoMaterial>) {
    setConsumos(consumos.map((c, i) => (i === index ? { ...c, ...patch } : c)))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = schema.safeParse({ clienteId, tecnicoNombre, fechaEntrada, vehiculoPlaca: vehiculo.placa })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    const tecnico = tecnicos.find((t) => t.nombre === tecnicoNombre)
    if (!clienteSeleccionado || !tecnico) {
      setError('Selecciona un cliente y un técnico.')
      return
    }

    const nueva: OrdenTrabajo = {
      numero: generateOrdenTrabajoNumero(),
      estado: 'recibido',
      fechaEntrada,
      fechaEntregaEstimada: fechaEntregaEstimada || null,
      fechaEntregaReal: null,
      descripcionTrabajo: descripcionTrabajo || null,
      tecnico,
      cliente: {
        nombre: clienteSeleccionado.nombre,
        tipo: clienteSeleccionado.tipo,
        cedulaRnc: clienteSeleccionado.cedulaRnc,
        telefono: clienteSeleccionado.telefono,
        correo: clienteSeleccionado.correo,
        esAseguradora: clienteSeleccionado.esAseguradora,
      },
      vehiculo,
      cotizacionRef: cotizacionRef || null,
      consumos: consumos.filter((c) => c.material.trim()),
    }
    addOrdenTrabajo(nueva)
    onClose()
    navigate(`/ordenes/${nueva.numero}`)
  }

  return (
    <Modal title="Nueva orden de trabajo" onClose={onClose} maxWidthClassName="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Cliente">
            <SearchableSelect
              value={clienteId}
              onChange={handleClienteChange}
              placeholder="Buscar cliente…"
              options={clientes.map((c) => ({ value: c.cedulaRnc, label: c.nombre, sublabel: c.cedulaRnc }))}
            />
          </Field>
          <Field label="Técnico asignado">
            <select value={tecnicoNombre} onChange={(e) => setTecnicoNombre(e.target.value)} className={fieldClass}>
              <option value="">Selecciona un técnico…</option>
              {tecnicos.map((t) => (
                <option key={t.nombre} value={t.nombre}>
                  {t.nombre} — {t.especialidad}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div>
          <p className="mb-2 text-[12.5px] font-medium text-muted">Vehículo</p>
          <VehiculoFields vehiculo={vehiculo} onChange={setVehiculo} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Entrada">
            <input type="date" value={fechaEntrada} onChange={(e) => setFechaEntrada(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="Entrega estimada (opcional)">
            <input
              type="date"
              value={fechaEntregaEstimada}
              onChange={(e) => setFechaEntregaEstimada(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Cotización de origen (opcional)">
            <select value={cotizacionRef} onChange={(e) => setCotizacionRef(e.target.value)} className={fieldClass}>
              <option value="">Ninguna</option>
              {cotizaciones.map((c) => (
                <option key={c.numero} value={c.numero}>
                  {c.numero}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Descripción del trabajo (opcional)">
          <textarea
            value={descripcionTrabajo}
            onChange={(e) => setDescripcionTrabajo(e.target.value)}
            rows={2}
            className={`${fieldClass} resize-none`}
          />
        </Field>

        <div>
          <p className="mb-2 text-[12.5px] font-medium text-muted">Materiales a consumir (opcional)</p>
          <div className="flex flex-col gap-2">
            {consumos.map((consumo, index) => (
              <div key={index} className="flex min-w-0 gap-2">
                <input
                  type="text"
                  value={consumo.material}
                  onChange={(e) => updateConsumo(index, { material: e.target.value })}
                  placeholder="Material"
                  className={`${fieldClass} min-w-0 flex-1`}
                />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={consumo.cantidad}
                  onChange={(e) => updateConsumo(index, { cantidad: parseFloat(e.target.value) || 0 })}
                  className={`${fieldClass} w-24`}
                />
                <input
                  type="text"
                  value={consumo.unidad}
                  onChange={(e) => updateConsumo(index, { unidad: e.target.value })}
                  placeholder="Unidad"
                  className={`${fieldClass} w-28`}
                />
                <button
                  type="button"
                  onClick={() => setConsumos(consumos.filter((_, i) => i !== index))}
                  aria-label="Eliminar material"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-error-soft hover:text-error"
                >
                  <IconTrash size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setConsumos([...consumos, { material: '', cantidad: 1, unidad: 'unidad' }])}
              className="flex items-center justify-center gap-2 rounded-md border border-dashed border-line py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-brand hover:text-brand"
            >
              <IconPlus size={14} /> Agregar material
            </button>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Crear orden de trabajo
          </Button>
        </div>
      </form>
    </Modal>
  )
}
