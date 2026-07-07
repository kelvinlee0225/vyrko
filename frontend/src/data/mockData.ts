export const taller = {
  nombre: 'Nang Yang',
  razonSocial: 'Nang Yang Auto Servicios SRL',
  rnc: '1-31-08452-3',
  direccion: 'Av. Máximo Gómez esq. José Contreras, Santo Domingo',
  telefono: '(809) 555-0142',
}

export interface LineaItem {
  descripcion: string
  tipo: 'servicio' | 'pieza'
  cantidad: number
  precioUnitario: number
  itbis: number
  descuento?: number
}

export interface Cliente {
  nombre: string
  tipo: string
  cedulaRnc: string
  telefono: string
  correo: string
  /** Mirrors the backend's Cliente.esAseguradora — this client is itself an insurance company. */
  esAseguradora?: boolean
}

export interface Vehiculo {
  marca: string
  modelo: string
  anio: number
  placa: string
  color: string
  vinChasis: string
  aseguradora: string
}

export type EstadoCotizacion = 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida'
export type EstadoFactura = 'pendiente' | 'pago_parcial' | 'pagada' | 'vencida' | 'anulada'

export interface Cotizacion {
  numero: string
  estado: EstadoCotizacion
  /** Backed by the real `created_at` column — Cotizacion has no separate "fecha emisión" field in the database. */
  createdAt: string
  fechaValidez: string
  cliente: Cliente
  vehiculo: Vehiculo
  lineas: LineaItem[]
  descuentoGlobal: number
  notas: string
}

export interface Factura {
  numero: string
  ncf: string
  estado: EstadoFactura
  fechaEmision: string
  fechaVencimiento: string
  metodoPago: string | null
  fechaPago: string | null
  montoPagado: number
  cotizacionRef: string
  ordenTrabajoRef: string
  cliente: Cliente
  vehiculo: Vehiculo
  lineas: LineaItem[]
  descuentoGlobal: number
  notas: string
}

export function calcularTotales(lineas: LineaItem[], descuentoGlobal = 0) {
  const subtotal = lineas.reduce((sum, l) => sum + l.cantidad * l.precioUnitario - (l.descuento ?? 0), 0)
  const itbis = lineas.reduce((sum, l) => sum + l.itbis, 0)
  const total = subtotal + itbis - descuentoGlobal
  return { subtotal, itbis, descuentoGlobal, total }
}

export const cotizaciones: Cotizacion[] = [
  {
    numero: 'COT-2026-0142',
    estado: 'enviada',
    createdAt: '2026-06-28',
    fechaValidez: '2026-07-12',
    cliente: {
      nombre: 'Rosa Almonte Peña',
      tipo: 'Persona física',
      cedulaRnc: '402-1234567-8',
      telefono: '(809) 555-8821',
      correo: 'rosa.almonte@gmail.com',
    },
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2019,
      placa: 'A567890',
      color: 'Gris plata',
      vinChasis: '2T1BURHE0KC123456',
      aseguradora: 'Seguros Universal',
    },
    lineas: [
      { descripcion: 'Diagnóstico de sistema de frenos', tipo: 'servicio', cantidad: 1, precioUnitario: 1200, itbis: 216 },
      { descripcion: 'Pastillas de freno delanteras (juego)', tipo: 'pieza', cantidad: 1, precioUnitario: 2800, itbis: 504 },
      { descripcion: 'Mano de obra — cambio de pastillas', tipo: 'servicio', cantidad: 1.5, precioUnitario: 900, itbis: 243 },
      { descripcion: 'Balanceo y rotación de neumáticos', tipo: 'servicio', cantidad: 1, precioUnitario: 1500, itbis: 270 },
    ],
    descuentoGlobal: 500,
    notas: 'Cliente autoriza inicio de trabajo previa aprobación de aseguradora. Vehículo permanece en taller.',
  },
  {
    numero: 'COT-2026-0140',
    estado: 'aprobada',
    createdAt: '2026-06-25',
    fechaValidez: '2026-07-09',
    cliente: {
      nombre: 'La Nacional de Seguros',
      tipo: 'Persona jurídica',
      cedulaRnc: '101-88012-3',
      telefono: '(809) 200-4400',
      correo: 'reclamos@lanacional.com.do',
      esAseguradora: true,
    },
    vehiculo: {
      marca: 'Kia',
      modelo: 'Sportage',
      anio: 2022,
      placa: 'EA1123',
      color: 'Negro',
      vinChasis: 'KNAPH812AN1234567',
      aseguradora: 'La Nacional de Seguros',
    },
    lineas: [
      { descripcion: 'Desabolladura panel trasero', tipo: 'servicio', cantidad: 1, precioUnitario: 12500, itbis: 2250 },
      { descripcion: 'Pintura y acabado', tipo: 'servicio', cantidad: 1, precioUnitario: 9800, itbis: 1764 },
      { descripcion: 'Sensor de parqueo (par)', tipo: 'pieza', cantidad: 1, precioUnitario: 3600, itbis: 648 },
    ],
    descuentoGlobal: 0,
    notas: 'Aprobada por ajustador. Programar entrada de vehículo con el cliente.',
  },
  {
    numero: 'COT-2026-0138',
    estado: 'borrador',
    createdAt: '2026-06-20',
    fechaValidez: '2026-07-04',
    cliente: {
      nombre: 'Seguros Universal, S.A.',
      tipo: 'Persona jurídica',
      cedulaRnc: '101-02345-6',
      telefono: '(809) 200-1000',
      correo: 'siniestros@segurosuniversal.com.do',
      esAseguradora: true,
    },
    vehiculo: {
      marca: 'Hyundai',
      modelo: 'Tucson',
      anio: 2021,
      placa: 'EG0234',
      color: 'Blanco',
      vinChasis: 'KM8J3CA46MU098765',
      aseguradora: 'Seguros Universal',
    },
    lineas: [
      { descripcion: 'Desabolladura y enderezado de chasis', tipo: 'servicio', cantidad: 1, precioUnitario: 8500, itbis: 1530 },
      { descripcion: 'Pintura y acabado (panel lateral derecho)', tipo: 'servicio', cantidad: 1, precioUnitario: 6200, itbis: 1116 },
      { descripcion: 'Guardafango delantero derecho (original)', tipo: 'pieza', cantidad: 1, precioUnitario: 9800, itbis: 1764 },
      { descripcion: 'Faro delantero derecho', tipo: 'pieza', cantidad: 1, precioUnitario: 4200, itbis: 756 },
    ],
    descuentoGlobal: 0,
    notas: 'Pendiente de fotos adicionales antes de enviar al cliente.',
  },
  {
    numero: 'COT-2026-0135',
    estado: 'rechazada',
    createdAt: '2026-06-15',
    fechaValidez: '2026-06-29',
    cliente: {
      nombre: 'Manuel Cabrera',
      tipo: 'Persona física',
      cedulaRnc: '001-1987654-3',
      telefono: '(809) 555-7742',
      correo: 'manuel.cabrera@hotmail.com',
    },
    vehiculo: {
      marca: 'Honda',
      modelo: 'CR-V',
      anio: 2018,
      placa: 'A889012',
      color: 'Rojo',
      vinChasis: '5J6RW2H89JL012345',
      aseguradora: '—',
    },
    lineas: [
      { descripcion: 'Cambio de embrague completo', tipo: 'servicio', cantidad: 1, precioUnitario: 14500, itbis: 2610 },
      { descripcion: 'Kit de embrague (original)', tipo: 'pieza', cantidad: 1, precioUnitario: 11200, itbis: 2016 },
    ],
    descuentoGlobal: 0,
    notas: 'Cliente rechazó por precio; solicitó cotización con piezas alternas.',
  },
  {
    numero: 'COT-2026-0130',
    estado: 'vencida',
    createdAt: '2026-05-20',
    fechaValidez: '2026-06-03',
    cliente: {
      nombre: 'Carlos Feliz Duarte',
      tipo: 'Persona física',
      cedulaRnc: '223-0456789-1',
      telefono: '(809) 555-3301',
      correo: 'carlos.feliz@gmail.com',
    },
    vehiculo: {
      marca: 'Nissan',
      modelo: 'Sentra',
      anio: 2020,
      placa: 'A345678',
      color: 'Azul',
      vinChasis: '3N1AB7AP0LY123456',
      aseguradora: '—',
    },
    lineas: [
      { descripcion: 'Cambio de correa de distribución', tipo: 'servicio', cantidad: 1, precioUnitario: 4200, itbis: 756 },
      { descripcion: 'Bomba de agua', tipo: 'pieza', cantidad: 1, precioUnitario: 2100, itbis: 378 },
    ],
    descuentoGlobal: 200,
    notas: 'Cliente nunca respondió; cotización vencida sin aprobar.',
  },
]

export const facturas: Factura[] = [
  {
    numero: 'B0100004521',
    ncf: 'E310000000247',
    estado: 'pendiente',
    fechaEmision: '2026-06-30',
    fechaVencimiento: '2026-07-15',
    metodoPago: null,
    fechaPago: null,
    montoPagado: 0,
    cotizacionRef: 'COT-2026-0138',
    ordenTrabajoRef: 'OT-2026-0291',
    cliente: {
      nombre: 'Seguros Universal, S.A.',
      tipo: 'Persona jurídica',
      cedulaRnc: '101-02345-6',
      telefono: '(809) 200-1000',
      correo: 'siniestros@segurosuniversal.com.do',
      esAseguradora: true,
    },
    vehiculo: {
      marca: 'Hyundai',
      modelo: 'Tucson',
      anio: 2021,
      placa: 'EG0234',
      color: 'Blanco',
      vinChasis: 'KM8J3CA46MU098765',
      aseguradora: 'Seguros Universal',
    },
    lineas: [
      { descripcion: 'Desabolladura y enderezado de chasis', tipo: 'servicio', cantidad: 1, precioUnitario: 8500, itbis: 1530 },
      { descripcion: 'Pintura y acabado (panel lateral derecho)', tipo: 'servicio', cantidad: 1, precioUnitario: 6200, itbis: 1116 },
      { descripcion: 'Guardafango delantero derecho (original)', tipo: 'pieza', cantidad: 1, precioUnitario: 9800, itbis: 1764 },
      { descripcion: 'Faro delantero derecho', tipo: 'pieza', cantidad: 1, precioUnitario: 4200, itbis: 756 },
    ],
    descuentoGlobal: 0,
    notas: 'Reparación por siniestro #SU-2026-11284. Fotos de daño adjuntas en el expediente digital.',
  },
  {
    numero: 'B0100004518',
    ncf: 'E310000000244',
    estado: 'pagada',
    fechaEmision: '2026-06-27',
    fechaVencimiento: '2026-07-11',
    metodoPago: 'Tarjeta de crédito',
    fechaPago: '2026-06-28',
    montoPagado: 4120,
    cotizacionRef: 'COT-2026-0130',
    ordenTrabajoRef: 'OT-2026-0288',
    cliente: {
      nombre: 'Carlos Feliz Duarte',
      tipo: 'Persona física',
      cedulaRnc: '223-0456789-1',
      telefono: '(809) 555-3301',
      correo: 'carlos.feliz@gmail.com',
    },
    vehiculo: {
      marca: 'Nissan',
      modelo: 'Sentra',
      anio: 2020,
      placa: 'A345678',
      color: 'Azul',
      vinChasis: '3N1AB7AP0LY123456',
      aseguradora: '—',
    },
    lineas: [
      { descripcion: 'Cambio de correa de distribución', tipo: 'servicio', cantidad: 1, precioUnitario: 2200, itbis: 396 },
      { descripcion: 'Bomba de agua', tipo: 'pieza', cantidad: 1, precioUnitario: 1100, itbis: 198 },
    ],
    descuentoGlobal: 0,
    notas: 'Pagado en su totalidad al retirar el vehículo.',
  },
  {
    numero: 'B0100004510',
    ncf: 'E310000000239',
    estado: 'vencida',
    fechaEmision: '2026-05-30',
    fechaVencimiento: '2026-06-14',
    metodoPago: null,
    fechaPago: null,
    montoPagado: 0,
    cotizacionRef: 'COT-2026-0121',
    ordenTrabajoRef: 'OT-2026-0270',
    cliente: {
      nombre: 'Manuel Cabrera',
      tipo: 'Persona física',
      cedulaRnc: '001-1987654-3',
      telefono: '(809) 555-7742',
      correo: 'manuel.cabrera@hotmail.com',
    },
    vehiculo: {
      marca: 'Honda',
      modelo: 'CR-V',
      anio: 2018,
      placa: 'A889012',
      color: 'Rojo',
      vinChasis: '5J6RW2H89JL012345',
      aseguradora: '—',
    },
    lineas: [{ descripcion: 'Cambio de embrague completo', tipo: 'servicio', cantidad: 1, precioUnitario: 14500, itbis: 2610 }],
    descuentoGlobal: 0,
    notas: 'Factura vencida sin pago; contactar a cliente para gestión de cobro.',
  },
  {
    numero: 'B0100004505',
    ncf: 'E310000000234',
    estado: 'anulada',
    fechaEmision: '2026-05-22',
    fechaVencimiento: '2026-06-06',
    metodoPago: null,
    fechaPago: null,
    montoPagado: 0,
    cotizacionRef: 'COT-2026-0115',
    ordenTrabajoRef: 'OT-2026-0261',
    cliente: {
      nombre: 'Rosa Almonte Peña',
      tipo: 'Persona física',
      cedulaRnc: '402-1234567-8',
      telefono: '(809) 555-8821',
      correo: 'rosa.almonte@gmail.com',
    },
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2019,
      placa: 'A567890',
      color: 'Gris plata',
      vinChasis: '2T1BURHE0KC123456',
      aseguradora: 'Seguros Universal',
    },
    lineas: [{ descripcion: 'Balanceo y rotación de neumáticos', tipo: 'servicio', cantidad: 1, precioUnitario: 1500, itbis: 270 }],
    descuentoGlobal: 0,
    notas: 'Anulada por duplicidad con B0100004503.',
  },
  {
    numero: 'B0100004499',
    ncf: 'E310000000228',
    estado: 'pagada',
    fechaEmision: '2026-05-10',
    fechaVencimiento: '2026-05-25',
    metodoPago: 'Transferencia',
    fechaPago: '2026-05-12',
    montoPagado: 52900,
    cotizacionRef: 'COT-2026-0108',
    ordenTrabajoRef: 'OT-2026-0250',
    cliente: {
      nombre: 'La Nacional de Seguros',
      tipo: 'Persona jurídica',
      cedulaRnc: '101-88012-3',
      telefono: '(809) 200-4400',
      correo: 'reclamos@lanacional.com.do',
      esAseguradora: true,
    },
    vehiculo: {
      marca: 'Kia',
      modelo: 'Sportage',
      anio: 2022,
      placa: 'EA1123',
      color: 'Negro',
      vinChasis: 'KNAPH812AN1234567',
      aseguradora: 'La Nacional de Seguros',
    },
    lineas: [
      { descripcion: 'Desabolladura panel trasero', tipo: 'servicio', cantidad: 1, precioUnitario: 12500, itbis: 2250 },
      { descripcion: 'Pintura y acabado', tipo: 'servicio', cantidad: 1, precioUnitario: 9800, itbis: 1764 },
      { descripcion: 'Sensor de parqueo (par)', tipo: 'pieza', cantidad: 1, precioUnitario: 3600, itbis: 648 },
    ],
    descuentoGlobal: 0,
    notas: 'Pagado por aseguradora vía transferencia bancaria.',
  },
  {
    numero: 'B0100004528',
    ncf: 'E310000000251',
    estado: 'pago_parcial',
    fechaEmision: '2026-07-01',
    fechaVencimiento: '2026-07-16',
    metodoPago: 'Efectivo',
    fechaPago: '2026-07-02',
    montoPagado: 6000,
    cotizacionRef: 'COT-2026-0135',
    ordenTrabajoRef: 'OT-2026-0296',
    cliente: {
      nombre: 'Manuel Cabrera',
      tipo: 'Persona física',
      cedulaRnc: '001-1987654-3',
      telefono: '(809) 555-7742',
      correo: 'manuel.cabrera@hotmail.com',
    },
    vehiculo: {
      marca: 'Honda',
      modelo: 'CR-V',
      anio: 2018,
      placa: 'A889012',
      color: 'Rojo',
      vinChasis: '5J6RW2H89JL012345',
      aseguradora: '—',
    },
    lineas: [
      { descripcion: 'Cambio de embrague completo', tipo: 'servicio', cantidad: 1, precioUnitario: 14500, itbis: 2610 },
      { descripcion: 'Kit de embrague (original)', tipo: 'pieza', cantidad: 1, precioUnitario: 11200, itbis: 2016 },
    ],
    descuentoGlobal: 0,
    notas: 'Cliente abonó al retirar el vehículo; resto contra entrega de piezas pendientes.',
  },
]

export interface Tecnico {
  nombre: string
  especialidad: string
}

export const tecnicos: Tecnico[] = [
  { nombre: 'Pedro Familia', especialidad: 'Mecánica general' },
  { nombre: 'Luis Ozuna', especialidad: 'Electricidad automotriz' },
  { nombre: 'Ramón Objío', especialidad: 'Pintura y carrocería' },
  { nombre: 'Freddy Vólquez', especialidad: 'Diagnóstico computarizado' },
]

export type EstadoOrdenTrabajo = 'recibido' | 'en_progreso' | 'esperando_piezas' | 'completado' | 'entregado' | 'cancelado'

export interface ConsumoMaterial {
  material: string
  cantidad: number
  unidad: string
}

export interface OrdenTrabajo {
  /** Display code only — `orden_trabajo` has no human-readable "numero" column in the database yet, just a UUID. */
  numero: string
  estado: EstadoOrdenTrabajo
  fechaEntrada: string
  fechaEntregaEstimada: string | null
  fechaEntregaReal: string | null
  descripcionTrabajo: string | null
  tecnico: Tecnico
  cliente: Cliente
  vehiculo: Vehiculo
  cotizacionRef: string | null
  consumos: ConsumoMaterial[]
}

export const ordenesTrabajo: OrdenTrabajo[] = [
  {
    numero: 'OT-2026-0291',
    estado: 'entregado',
    fechaEntrada: '2026-06-24',
    fechaEntregaEstimada: '2026-06-29',
    fechaEntregaReal: '2026-06-29',
    descripcionTrabajo:
      'Desabolladura y enderezado de chasis, pintura de panel lateral derecho, reemplazo de guardafango y faro delantero derecho.',
    tecnico: tecnicos[2],
    cliente: {
      nombre: 'Seguros Universal, S.A.',
      tipo: 'Persona jurídica',
      cedulaRnc: '101-02345-6',
      telefono: '(809) 200-1000',
      correo: 'siniestros@segurosuniversal.com.do',
      esAseguradora: true,
    },
    vehiculo: {
      marca: 'Hyundai',
      modelo: 'Tucson',
      anio: 2021,
      placa: 'EG0234',
      color: 'Blanco',
      vinChasis: 'KM8J3CA46MU098765',
      aseguradora: 'Seguros Universal',
    },
    cotizacionRef: 'COT-2026-0138',
    consumos: [
      { material: 'Guardafango delantero derecho (original)', cantidad: 1, unidad: 'unidad' },
      { material: 'Faro delantero derecho', cantidad: 1, unidad: 'unidad' },
    ],
  },
  {
    numero: 'OT-2026-0288',
    estado: 'entregado',
    fechaEntrada: '2026-06-22',
    fechaEntregaEstimada: '2026-06-26',
    fechaEntregaReal: '2026-06-26',
    descripcionTrabajo: 'Cambio de correa de distribución y bomba de agua.',
    tecnico: tecnicos[0],
    cliente: {
      nombre: 'Carlos Feliz Duarte',
      tipo: 'Persona física',
      cedulaRnc: '223-0456789-1',
      telefono: '(809) 555-3301',
      correo: 'carlos.feliz@gmail.com',
    },
    vehiculo: {
      marca: 'Nissan',
      modelo: 'Sentra',
      anio: 2020,
      placa: 'A345678',
      color: 'Azul',
      vinChasis: '3N1AB7AP0LY123456',
      aseguradora: '—',
    },
    cotizacionRef: 'COT-2026-0130',
    consumos: [
      { material: 'Correa de distribución', cantidad: 1, unidad: 'kit' },
      { material: 'Bomba de agua', cantidad: 1, unidad: 'unidad' },
    ],
  },
  {
    numero: 'OT-2026-0270',
    estado: 'entregado',
    fechaEntrada: '2026-05-28',
    fechaEntregaEstimada: '2026-06-02',
    fechaEntregaReal: '2026-06-03',
    descripcionTrabajo: 'Cambio de embrague completo.',
    tecnico: tecnicos[0],
    cliente: {
      nombre: 'Manuel Cabrera',
      tipo: 'Persona física',
      cedulaRnc: '001-1987654-3',
      telefono: '(809) 555-7742',
      correo: 'manuel.cabrera@hotmail.com',
    },
    vehiculo: {
      marca: 'Honda',
      modelo: 'CR-V',
      anio: 2018,
      placa: 'A889012',
      color: 'Rojo',
      vinChasis: '5J6RW2H89JL012345',
      aseguradora: '—',
    },
    cotizacionRef: 'COT-2026-0121',
    consumos: [{ material: 'Kit de embrague', cantidad: 1, unidad: 'kit' }],
  },
  {
    numero: 'OT-2026-0261',
    estado: 'entregado',
    fechaEntrada: '2026-05-20',
    fechaEntregaEstimada: '2026-05-21',
    fechaEntregaReal: '2026-05-21',
    descripcionTrabajo: 'Balanceo y rotación de neumáticos.',
    tecnico: tecnicos[0],
    cliente: {
      nombre: 'Rosa Almonte Peña',
      tipo: 'Persona física',
      cedulaRnc: '402-1234567-8',
      telefono: '(809) 555-8821',
      correo: 'rosa.almonte@gmail.com',
    },
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2019,
      placa: 'A567890',
      color: 'Gris plata',
      vinChasis: '2T1BURHE0KC123456',
      aseguradora: 'Seguros Universal',
    },
    cotizacionRef: 'COT-2026-0115',
    consumos: [],
  },
  {
    numero: 'OT-2026-0250',
    estado: 'entregado',
    fechaEntrada: '2026-05-06',
    fechaEntregaEstimada: '2026-05-10',
    fechaEntregaReal: '2026-05-10',
    descripcionTrabajo: 'Desabolladura de panel trasero, pintura y acabado, sensores de parqueo.',
    tecnico: tecnicos[2],
    cliente: {
      nombre: 'La Nacional de Seguros',
      tipo: 'Persona jurídica',
      cedulaRnc: '101-88012-3',
      telefono: '(809) 200-4400',
      correo: 'reclamos@lanacional.com.do',
      esAseguradora: true,
    },
    vehiculo: {
      marca: 'Kia',
      modelo: 'Sportage',
      anio: 2022,
      placa: 'EA1123',
      color: 'Negro',
      vinChasis: 'KNAPH812AN1234567',
      aseguradora: 'La Nacional de Seguros',
    },
    cotizacionRef: 'COT-2026-0108',
    consumos: [{ material: 'Sensor de parqueo (par)', cantidad: 1, unidad: 'juego' }],
  },
  {
    numero: 'OT-2026-0296',
    estado: 'entregado',
    fechaEntrada: '2026-06-29',
    fechaEntregaEstimada: '2026-07-01',
    fechaEntregaReal: '2026-07-01',
    descripcionTrabajo: 'Cambio de embrague completo (segunda unidad).',
    tecnico: tecnicos[0],
    cliente: {
      nombre: 'Manuel Cabrera',
      tipo: 'Persona física',
      cedulaRnc: '001-1987654-3',
      telefono: '(809) 555-7742',
      correo: 'manuel.cabrera@hotmail.com',
    },
    vehiculo: {
      marca: 'Honda',
      modelo: 'CR-V',
      anio: 2018,
      placa: 'A889012',
      color: 'Rojo',
      vinChasis: '5J6RW2H89JL012345',
      aseguradora: '—',
    },
    cotizacionRef: 'COT-2026-0135',
    consumos: [{ material: 'Kit de embrague', cantidad: 1, unidad: 'kit' }],
  },
  {
    numero: 'OT-2026-0295',
    estado: 'en_progreso',
    fechaEntrada: '2026-07-04',
    fechaEntregaEstimada: '2026-07-08',
    fechaEntregaReal: null,
    descripcionTrabajo: 'Diagnóstico de falla eléctrica intermitente en panel de instrumentos.',
    tecnico: tecnicos[1],
    cliente: {
      nombre: 'Manuel Cabrera',
      tipo: 'Persona física',
      cedulaRnc: '001-1987654-3',
      telefono: '(809) 555-7742',
      correo: 'manuel.cabrera@hotmail.com',
    },
    vehiculo: {
      marca: 'Honda',
      modelo: 'CR-V',
      anio: 2018,
      placa: 'A889012',
      color: 'Rojo',
      vinChasis: '5J6RW2H89JL012345',
      aseguradora: '—',
    },
    cotizacionRef: null,
    consumos: [],
  },
  {
    numero: 'OT-2026-0297',
    estado: 'esperando_piezas',
    fechaEntrada: '2026-07-02',
    fechaEntregaEstimada: '2026-07-10',
    fechaEntregaReal: null,
    descripcionTrabajo: 'Reparación de nuevo siniestro: parachoques delantero y radiador.',
    tecnico: tecnicos[2],
    cliente: {
      nombre: 'La Nacional de Seguros',
      tipo: 'Persona jurídica',
      cedulaRnc: '101-88012-3',
      telefono: '(809) 200-4400',
      correo: 'reclamos@lanacional.com.do',
      esAseguradora: true,
    },
    vehiculo: {
      marca: 'Kia',
      modelo: 'Sportage',
      anio: 2022,
      placa: 'EA1123',
      color: 'Negro',
      vinChasis: 'KNAPH812AN1234567',
      aseguradora: 'La Nacional de Seguros',
    },
    cotizacionRef: 'COT-2026-0140',
    consumos: [
      { material: 'Parachoques delantero', cantidad: 1, unidad: 'unidad' },
      { material: 'Radiador', cantidad: 1, unidad: 'unidad' },
    ],
  },
  {
    numero: 'OT-2026-0298',
    estado: 'recibido',
    fechaEntrada: '2026-07-05',
    fechaEntregaEstimada: null,
    fechaEntregaReal: null,
    descripcionTrabajo: 'Diagnóstico inicial de sistema de frenos; pendiente aprobación de cotización COT-2026-0142.',
    tecnico: tecnicos[3],
    cliente: {
      nombre: 'Rosa Almonte Peña',
      tipo: 'Persona física',
      cedulaRnc: '402-1234567-8',
      telefono: '(809) 555-8821',
      correo: 'rosa.almonte@gmail.com',
    },
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2019,
      placa: 'A567890',
      color: 'Gris plata',
      vinChasis: '2T1BURHE0KC123456',
      aseguradora: 'Seguros Universal',
    },
    cotizacionRef: null,
    consumos: [],
  },
]

export interface ClienteDirectorio extends Cliente {
  direccion: string
  limiteCredito: number | null
  diasCredito: number | null
  vehiculos: { placa: string; marca: string; modelo: string; anio: number; color: string }[]
}

export const clientes: ClienteDirectorio[] = [
  {
    nombre: 'Rosa Almonte Peña',
    tipo: 'Persona física',
    cedulaRnc: '402-1234567-8',
    telefono: '(809) 555-8821',
    correo: 'rosa.almonte@gmail.com',
    direccion: 'Calle Duarte #45, Los Alcarrizos, Santo Domingo Oeste',
    limiteCredito: null,
    diasCredito: null,
    vehiculos: [{ placa: 'A567890', marca: 'Toyota', modelo: 'Corolla', anio: 2019, color: 'Gris plata' }],
  },
  {
    nombre: 'Manuel Cabrera',
    tipo: 'Persona física',
    cedulaRnc: '001-1987654-3',
    telefono: '(809) 555-7742',
    correo: 'manuel.cabrera@hotmail.com',
    direccion: 'Av. Independencia #212, Santo Domingo',
    limiteCredito: null,
    diasCredito: null,
    vehiculos: [{ placa: 'A889012', marca: 'Honda', modelo: 'CR-V', anio: 2018, color: 'Rojo' }],
  },
  {
    nombre: 'Carlos Feliz Duarte',
    tipo: 'Persona física',
    cedulaRnc: '223-0456789-1',
    telefono: '(809) 555-3301',
    correo: 'carlos.feliz@gmail.com',
    direccion: 'Calle Proyecto 4 #10, Los Mina, Santo Domingo Este',
    limiteCredito: null,
    diasCredito: null,
    vehiculos: [{ placa: 'A345678', marca: 'Nissan', modelo: 'Sentra', anio: 2020, color: 'Azul' }],
  },
  {
    nombre: 'Yolanda Restituyo',
    tipo: 'Persona física',
    cedulaRnc: '501-2345678-9',
    telefono: '(809) 555-6612',
    correo: 'yolanda.restituyo@gmail.com',
    direccion: 'Calle El Sol #78, Santiago de los Caballeros',
    limiteCredito: null,
    diasCredito: null,
    vehiculos: [{ placa: 'A778899', marca: 'Mazda', modelo: 'CX-5', anio: 2023, color: 'Blanco perla' }],
  },
  {
    nombre: 'Seguros Universal, S.A.',
    tipo: 'Persona jurídica',
    cedulaRnc: '101-02345-6',
    telefono: '(809) 200-1000',
    correo: 'siniestros@segurosuniversal.com.do',
    esAseguradora: true,
    direccion: 'Av. Winston Churchill #1099, Torre Novo-Centro, Santo Domingo',
    limiteCredito: 500000,
    diasCredito: 30,
    vehiculos: [],
  },
  {
    nombre: 'La Nacional de Seguros',
    tipo: 'Persona jurídica',
    cedulaRnc: '101-88012-3',
    telefono: '(809) 200-4400',
    correo: 'reclamos@lanacional.com.do',
    esAseguradora: true,
    direccion: 'Av. John F. Kennedy #64, Santo Domingo',
    limiteCredito: 400000,
    diasCredito: 30,
    vehiculos: [],
  },
]

export const actividadReciente = [
  { tipo: 'factura', numero: 'B0100004521', descripcion: 'Seguros Universal, S.A.', monto: 'RD$ 33,866.00', estado: 'pendiente', hora: 'Hace 12 min' },
  { tipo: 'cotizacion', numero: 'COT-2026-0142', descripcion: 'Rosa Almonte Peña', monto: 'RD$ 7,583.00', estado: 'enviada', hora: 'Hace 40 min' },
  { tipo: 'orden', numero: 'OT-2026-0295', descripcion: 'Manuel Cabrera — Honda CR-V', monto: '—', estado: 'en_progreso', hora: 'Hace 1 h' },
  { tipo: 'factura', numero: 'B0100004518', descripcion: 'Carlos Feliz Duarte', monto: 'RD$ 4,120.00', estado: 'pagada', hora: 'Hace 3 h' },
  { tipo: 'cotizacion', numero: 'COT-2026-0140', descripcion: 'La Nacional de Seguros', monto: 'RD$ 52,900.00', estado: 'aprobada', hora: 'Ayer' },
]
