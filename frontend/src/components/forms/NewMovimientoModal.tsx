import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from './fields'
import { SearchableSelect } from './SearchableSelect'
import { useApiList } from '../../hooks/useApiList'
import { materialService } from '../../services/material'
import { proveedorService } from '../../services/proveedor'
import { movimientoInventarioService } from '../../services/movimientoInventario'

interface NewMovimientoModalProps {
  onClose: () => void
  initialMaterialId?: string
}

const schema = z.object({
  materialId: z.string().min(1, 'Selecciona un material.'),
  cantidad: z.string().min(1, 'Ingresa la cantidad.'),
})

export function NewMovimientoModal({ onClose, initialMaterialId }: NewMovimientoModalProps) {
  const { data: materiales } = useApiList(materialService.list)
  const { data: proveedores } = useApiList(proveedorService.list)

  const [materialId, setMaterialId] = useState(initialMaterialId ?? '')
  const [tipoMovimiento, setTipoMovimiento] = useState<'entrada' | 'salida'>('entrada')
  const [cantidad, setCantidad] = useState('')
  const [proveedorId, setProveedorId] = useState('')
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const materialSeleccionado = materiales.find((m) => m.id === materialId)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ materialId, cantidad })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    if (!materialSeleccionado) {
      setError('Selecciona un material.')
      return
    }
    const cantidadNum = parseFloat(cantidad)
    if (cantidadNum <= 0) {
      setError('La cantidad debe ser mayor a cero.')
      return
    }
    const stockActual = parseFloat(materialSeleccionado.stockActual)
    if (tipoMovimiento === 'salida' && cantidadNum > stockActual) {
      setError(`No hay suficiente stock: quedan ${stockActual} unidades de ${materialSeleccionado.nombre}.`)
      return
    }

    setSubmitting(true)
    try {
      await movimientoInventarioService.create({
        materialId,
        proveedorId: proveedorId || undefined,
        tipoMovimiento,
        cantidad,
        motivo: motivo || undefined,
      })
      onClose()
    } catch {
      setError('No se pudo registrar el movimiento. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Registrar movimiento de inventario" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Material">
          <SearchableSelect
            value={materialId}
            onChange={setMaterialId}
            placeholder="Buscar material…"
            options={materiales.map((m) => ({
              value: m.id,
              label: m.nombre,
              sublabel: `${m.codigo} · Stock: ${m.stockActual}`,
            }))}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo de movimiento">
            <select
              value={tipoMovimiento}
              onChange={(e) => setTipoMovimiento(e.target.value as 'entrada' | 'salida')}
              className={fieldClass}
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </Field>
          <Field label="Cantidad">
            <input
              type="number"
              min="0"
              step="0.5"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>

        <Field label="Proveedor (opcional)">
          <select value={proveedorId} onChange={(e) => setProveedorId(e.target.value)} className={fieldClass}>
            <option value="">Ninguno</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Motivo (opcional)">
          <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} className={fieldClass} />
        </Field>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Registrando…' : 'Registrar movimiento'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
