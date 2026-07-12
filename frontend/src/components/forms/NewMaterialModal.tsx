import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from './fields'
import { useApiList } from '../../hooks/useApiList'
import { categoriaMaterialService } from '../../services/categoriaMaterial'
import { materialService } from '../../services/material'

const schema = z.object({
  codigo: z.string().min(2, 'Ingresa un código.'),
  nombre: z.string().min(2, 'Ingresa el nombre del material.'),
  categoriaId: z.string().min(1, 'Selecciona una categoría.'),
  precioCosto: z.string().min(1, 'Ingresa el costo.'),
})

export function NewMaterialModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { data: categorias } = useApiList(categoriaMaterialService.list)

  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [precioCosto, setPrecioCosto] = useState('')
  const [stockMinimo, setStockMinimo] = useState('0')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ codigo, nombre, categoriaId, precioCosto })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      const nuevo = await materialService.create({
        codigo,
        nombre,
        categoriaId,
        precioCosto,
        stockMinimo: stockMinimo ? parseInt(stockMinimo, 10) : undefined,
      })
      onClose()
      navigate(`/inventario/${nuevo.id}`)
    } catch {
      setError('No se pudo crear el material. Verifica que el código no esté en uso.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Nuevo material" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Código">
            <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="Categoría">
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={fieldClass}>
              <option value="">Selecciona una categoría…</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Nombre">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={fieldClass} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Costo">
            <input
              type="number"
              min="0"
              step="0.01"
              value={precioCosto}
              onChange={(e) => setPrecioCosto(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Stock mínimo">
            <input
              type="number"
              min="0"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(e.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>
        <p className="text-[11.5px] text-muted">
          El material se registra con 0 unidades en existencia — usa "Registrar movimiento" para agregar stock.
        </p>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Creando…' : 'Crear material'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
