import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { Login } from './pages/login/Login'
import { Dashboard } from './pages/dashboard/Dashboard'
import { QuoteList } from './pages/quote/QuoteList'
import { NewQuote } from './pages/quote/NewQuote'
import { EditQuote } from './pages/quote/EditQuote'
import { Quote } from './pages/quote/Quote'
import { InvoiceList } from './pages/invoice/InvoiceList'
import { NewInvoice } from './pages/invoice/NewInvoice'
import { Invoice } from './pages/invoice/Invoice'
import { WorkOrderList } from './pages/work-order/WorkOrderList'
import { WorkOrder } from './pages/work-order/WorkOrder'
import { ClientList } from './pages/client/ClientList'
import { Client } from './pages/client/Client'
import { MaterialList } from './pages/material/MaterialList'
import { Material } from './pages/material/Material'
import { TecnicoList } from './pages/tecnico/TecnicoList'
import { Catalogos } from './pages/catalogos/Catalogos'
import { RequireAdmin } from './components/RequireAdmin'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="cotizaciones" element={<QuoteList />} />
              <Route path="cotizaciones/nueva" element={<NewQuote />} />
              <Route path="cotizaciones/:id" element={<Quote />} />
              <Route path="cotizaciones/:id/editar" element={<EditQuote />} />
              <Route path="facturacion" element={<InvoiceList />} />
              <Route path="facturacion/nueva" element={<NewInvoice />} />
              <Route path="facturacion/:id" element={<Invoice />} />
              <Route path="ordenes" element={<WorkOrderList />} />
              <Route path="ordenes/:id" element={<WorkOrder />} />
              <Route path="clientes" element={<ClientList />} />
              <Route path="clientes/:id" element={<Client />} />
              <Route path="inventario" element={<MaterialList />} />
              <Route path="inventario/:id" element={<Material />} />
              <Route path="catalogos" element={<Catalogos />} />
              <Route
                path="tecnicos"
                element={
                  <RequireAdmin>
                    <TecnicoList />
                  </RequireAdmin>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
