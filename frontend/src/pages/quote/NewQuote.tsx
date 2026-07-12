import { useNavigate } from 'react-router-dom'
import { QuoteForm } from '../../components/forms/QuoteForm'
import { emptyLinea } from '../../components/forms/lineaItemDraft'
import { cotizacionService } from '../../services/cotizacion'

export function NewQuote() {
  const navigate = useNavigate()

  return (
    <QuoteForm
      heading="Nueva cotización"
      description="Completa los datos para crear una nueva cotización."
      submitLabel="Crear cotización"
      submittingLabel="Creando…"
      initial={{
        clienteId: '',
        vehiculoId: '',
        fechaValidez: '',
        descuentoGlobal: '0',
        notas: '',
        lineas: [emptyLinea()],
      }}
      onCancel={() => navigate('/cotizaciones')}
      onSubmit={async (payload) => {
        const nueva = await cotizacionService.create(payload)
        navigate(`/cotizaciones/${nueva.id}`)
      }}
    />
  )
}
