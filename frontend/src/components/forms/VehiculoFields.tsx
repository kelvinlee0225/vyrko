import type { Vehiculo } from '../../data/mockData'
import { Field, fieldClass } from './fields'

interface VehiculoFieldsProps {
  vehiculo: Vehiculo
  onChange: (vehiculo: Vehiculo) => void
}

export function VehiculoFields({ vehiculo, onChange }: VehiculoFieldsProps) {
  function set<K extends keyof Vehiculo>(key: K, value: Vehiculo[K]) {
    onChange({ ...vehiculo, [key]: value })
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Placa">
        <input type="text" value={vehiculo.placa} onChange={(e) => set('placa', e.target.value)} className={fieldClass} />
      </Field>
      <Field label="Color">
        <input type="text" value={vehiculo.color} onChange={(e) => set('color', e.target.value)} className={fieldClass} />
      </Field>
      <Field label="Marca">
        <input type="text" value={vehiculo.marca} onChange={(e) => set('marca', e.target.value)} className={fieldClass} />
      </Field>
      <Field label="Modelo">
        <input type="text" value={vehiculo.modelo} onChange={(e) => set('modelo', e.target.value)} className={fieldClass} />
      </Field>
      <Field label="Año">
        <input
          type="number"
          value={vehiculo.anio}
          onChange={(e) => set('anio', parseInt(e.target.value, 10) || 0)}
          className={fieldClass}
        />
      </Field>
      <Field label="VIN / Chasis">
        <input type="text" value={vehiculo.vinChasis} onChange={(e) => set('vinChasis', e.target.value)} className={fieldClass} />
      </Field>
      <div className="col-span-2">
        <Field label="Aseguradora">
          <input
            type="text"
            value={vehiculo.aseguradora}
            onChange={(e) => set('aseguradora', e.target.value)}
            placeholder="— si no aplica"
            className={fieldClass}
          />
        </Field>
      </div>
    </div>
  )
}
