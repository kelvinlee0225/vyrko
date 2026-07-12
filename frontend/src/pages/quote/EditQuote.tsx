import { Link, useNavigate, useParams } from 'react-router-dom'
import { QuoteForm } from '../../components/forms/QuoteForm'
import { useApiResource } from '../../hooks/useApiResource'
import { cotizacionService } from '../../services/cotizacion'

export function EditQuote() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: c, loading, error } = useApiResource(() => cotizacionService.get(id!), id)

  if (loading) {
    return <p className="text-[13.5px] text-muted">Cargando cotización…</p>
  }

  if (error || !c) {
    return (
      <div className="flex flex-col gap-4">
        <Link to="/cotizaciones" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
          ← Volver a cotizaciones
        </Link>
        <p className="text-[13.5px] text-muted">{error ?? `No se encontró la cotización ${id}.`}</p>
      </div>
    )
  }

  return (
    <QuoteForm
      heading={`Editar cotización ${c.numero}`}
      description="Actualiza los datos de la cotización y guarda los cambios."
      submitLabel="Guardar cambios"
      submittingLabel="Guardando…"
      initial={{
        clienteId: c.cliente.id,
        vehiculoId: c.vehiculo.id,
        fechaValidez: c.fechaValidez,
        descuentoGlobal: c.descuentoGlobal ?? '0',
        notas: c.notas ?? '',
        lineas: c.lineas.map((l) => ({
          servicioId: l.servicio.id,
          piezaId: l.pieza?.id ?? null,
          descripcion: l.descripcion,
          cantidad: parseFloat(l.cantidad),
          precioUnitario: parseFloat(l.precioUnitario),
          itbis: parseFloat(l.itbis),
          descuento: l.descuento ? parseFloat(l.descuento) : 0,
        })),
      }}
      onCancel={() => navigate(`/cotizaciones/${c.id}`)}
      onSubmit={async (payload) => {
        await cotizacionService.update(c.id, payload)
        navigate(`/cotizaciones/${c.id}`)
      }}
    />
  )
}
