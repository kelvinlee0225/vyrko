import { useState } from 'react'
import { SearchableSelect } from './SearchableSelect'
import { NewVehiculoModal } from './NewVehiculoModal'
import { Field, fieldClass } from './fields'
import { IconPlus } from '../ui/icons'
import type { Vehiculo } from '../../services/vehiculo'

interface VehiculoPickerProps {
  vehiculos: Vehiculo[]
  value: string
  onChange: (id: string) => void
  clienteId: string
  onVehiculoCreated: () => void
}

const readonlyFieldClass = `${fieldClass} cursor-not-allowed opacity-60`

export function VehiculoPicker({ vehiculos, value, onChange, clienteId, onVehiculoCreated }: VehiculoPickerProps) {
  const [showNewVehiculo, setShowNewVehiculo] = useState(false)
  const seleccionado = vehiculos.find((v) => v.id === value)

  return (
    <div className="flex flex-col gap-3">
      {vehiculos.length === 0 ? (
        <p className="text-[12.5px] text-muted">Este cliente no tiene vehículos registrados todavía.</p>
      ) : (
        <SearchableSelect
          value={value}
          onChange={onChange}
          placeholder="Buscar vehículo…"
          options={vehiculos.map((v) => ({
            value: v.id,
            label: `${v.placa} — ${v.marca} ${v.modelo}`,
            sublabel: `${v.año} · ${v.color}`,
          }))}
        />
      )}

      {seleccionado && (
        <div className="flex flex-col gap-3 rounded-md border border-line bg-canvas p-3">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Placa">
              <input type="text" value={seleccionado.placa} disabled className={readonlyFieldClass} />
            </Field>
            <Field label="Marca">
              <input type="text" value={seleccionado.marca} disabled className={readonlyFieldClass} />
            </Field>
            <Field label="Modelo">
              <input type="text" value={seleccionado.modelo} disabled className={readonlyFieldClass} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Año">
              <input type="text" value={String(seleccionado.año)} disabled className={readonlyFieldClass} />
            </Field>
            <Field label="Color">
              <input type="text" value={seleccionado.color} disabled className={readonlyFieldClass} />
            </Field>
            <Field label="VIN / Chasis">
              <input type="text" value={seleccionado.vinChasis ?? '—'} disabled className={readonlyFieldClass} />
            </Field>
          </div>
          <Field label="Aseguradora">
            <input type="text" value={seleccionado.aseguradora.nombre} disabled className={readonlyFieldClass} />
          </Field>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowNewVehiculo(true)}
        className="flex items-center justify-center gap-2 rounded-md border border-dashed border-line py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-brand hover:text-brand"
      >
        <IconPlus size={14} /> Registrar vehículo
      </button>

      {showNewVehiculo && (
        <NewVehiculoModal
          clienteId={clienteId}
          onClose={() => setShowNewVehiculo(false)}
          onCreated={(nuevo) => {
            onVehiculoCreated()
            onChange(nuevo.id)
            setShowNewVehiculo(false)
          }}
        />
      )}
    </div>
  )
}
