import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { QuoteList } from './pages/QuoteList'
import { NewQuote } from './pages/NewQuote'
import { Quote } from './pages/Quote'
import { InvoiceList } from './pages/InvoiceList'
import { NewInvoice } from './pages/NewInvoice'
import { Invoice } from './pages/Invoice'
import { WorkOrderList } from './pages/WorkOrderList'
import { WorkOrder } from './pages/WorkOrder'
import { ClientList } from './pages/ClientList'
import { Client } from './pages/Client'

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
              <Route path="cotizaciones/:numero" element={<Quote />} />
              <Route path="facturacion" element={<InvoiceList />} />
              <Route path="facturacion/nueva" element={<NewInvoice />} />
              <Route path="facturacion/:numero" element={<Invoice />} />
              <Route path="ordenes" element={<WorkOrderList />} />
              <Route path="ordenes/:numero" element={<WorkOrder />} />
              <Route path="clientes" element={<ClientList />} />
              <Route path="clientes/:cedulaRnc" element={<Client />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
