# Graph Report - vyrko  (2026-08-27)

## Corpus Check
- 279 files · ~70,656 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1612 nodes · 3872 edges · 67 communities (55 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fc3ce807`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Client & Vehicle Management|Client & Vehicle Management]]
- [[_COMMUNITY_Authentication & User Roles|Authentication & User Roles]]
- [[_COMMUNITY_DGII Web Services & Contingency|DGII Web Services & Contingency]]
- [[_COMMUNITY_Free Invoicing Tool (Facturador Gratuito)|Free Invoicing Tool (Facturador Gratuito)]]
- [[_COMMUNITY_e-CF Message Formats & Certification|e-CF Message Formats & Certification]]
- [[_COMMUNITY_Material & Inventory Catalog|Material & Inventory Catalog]]
- [[_COMMUNITY_Digital Signing & Role Delegation|Digital Signing & Role Delegation]]
- [[_COMMUNITY_Work Orders & JWT Auth|Work Orders & JWT Auth]]
- [[_COMMUNITY_Inventory Movements & Suppliers|Inventory Movements & Suppliers]]
- [[_COMMUNITY_Quotes (Cotizaciones)|Quotes (Cotizaciones)]]
- [[_COMMUNITY_Backend Dev Dependencies|Backend Dev Dependencies]]
- [[_COMMUNITY_e-CF Technical Norms & Services|e-CF Technical Norms & Services]]
- [[_COMMUNITY_Insurance Companies (Aseguradora)|Insurance Companies (Aseguradora)]]
- [[_COMMUNITY_Vehicle Parts (Pieza)|Vehicle Parts (Pieza)]]
- [[_COMMUNITY_Services Catalog (Servicio)|Services Catalog (Servicio)]]
- [[_COMMUNITY_Technicians (Tecnico)|Technicians (Tecnico)]]
- [[_COMMUNITY_TypeScript Compiler Config|TypeScript Compiler Config]]
- [[_COMMUNITY_e-CF Format & Tax Tables|e-CF Format & Tax Tables]]
- [[_COMMUNITY_Electronic Issuer Certification|Electronic Issuer Certification]]
- [[_COMMUNITY_Backend Runtime Dependencies|Backend Runtime Dependencies]]
- [[_COMMUNITY_Backend NPM Scripts|Backend NPM Scripts]]
- [[_COMMUNITY_Company Profile (Empresa)|Company Profile (Empresa)]]
- [[_COMMUNITY_Admin User Request for e-CF|Admin User Request for e-CF]]
- [[_COMMUNITY_App Bootstrap & Auth Guards|App Bootstrap & Auth Guards]]
- [[_COMMUNITY_Jest Test Config|Jest Test Config]]
- [[_COMMUNITY_NestJS CLI Config|NestJS CLI Config]]
- [[_COMMUNITY_Package Metadata|Package Metadata]]
- [[_COMMUNITY_Agent Governance Rules|Agent Governance Rules]]
- [[_COMMUNITY_DB Migration Init Schema|DB Migration: Init Schema]]
- [[_COMMUNITY_DB Migration Inventory Catalog|DB Migration: Inventory Catalog]]
- [[_COMMUNITY_DB Migration Add Aseguradora|DB Migration: Add Aseguradora]]
- [[_COMMUNITY_DB Migration Add Cotizacion|DB Migration: Add Cotizacion]]
- [[_COMMUNITY_TecnicoService|TecnicoService]]
- [[_COMMUNITY_Invoice.tsx|Invoice.tsx]]
- [[_COMMUNITY_TypeScript Build Config|TypeScript Build Config]]
- [[_COMMUNITY_Consumer Invoice Summary Rules|Consumer Invoice Summary Rules]]
- [[_COMMUNITY_Backend README|Backend README]]
- [[_COMMUNITY_icons.tsx|icons.tsx]]
- [[_COMMUNITY_FE Service Provider Certification|FE Service Provider Certification]]
- [[_COMMUNITY_Frontend Entry Point|Frontend Entry Point]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_InvoiceList.tsx|InvoiceList.tsx]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_app.controller.ts|app.controller.ts]]
- [[_COMMUNITY_icons.tsx|icons.tsx]]
- [[_COMMUNITY_React + TypeScript + Vite|React + TypeScript + Vite]]
- [[_COMMUNITY_tsconfig.json|tsconfig.json]]
- [[_COMMUNITY_AddInventoryCatalog1783024534404|AddInventoryCatalog1783024534404]]
- [[_COMMUNITY_mockData.ts|mockData.ts]]
- [[_COMMUNITY_useDataStore|useDataStore]]
- [[_COMMUNITY_AseguradoraService|AseguradoraService]]
- [[_COMMUNITY_ProveedorService|ProveedorService]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_cotizacion.ts|cotizacion.ts]]
- [[_COMMUNITY_PiezaService|PiezaService]]
- [[_COMMUNITY_crud.ts|crud.ts]]
- [[_COMMUNITY_factura.ts|factura.ts]]
- [[_COMMUNITY_ordenTrabajo.ts|ordenTrabajo.ts]]
- [[_COMMUNITY_vehiculo.ts|vehiculo.ts]]
- [[_COMMUNITY_AppModule|AppModule]]
- [[_COMMUNITY_AddInventoryCatalog1783024534404|AddInventoryCatalog1783024534404]]
- [[_COMMUNITY_AddCotizacion1783043552605|AddCotizacion1783043552605]]
- [[_COMMUNITY_AddMovimientoInventario1783051968531|AddMovimientoInventario1783051968531]]
- [[_COMMUNITY_EnumFacturaEstado1783799540998|EnumFacturaEstado1783799540998]]

## God Nodes (most connected - your core abstractions)
1. `useApiList()` - 49 edges
2. `Informe Técnico Comprobante Fiscal Electrónico v1.0` - 39 edges
3. `Factura` - 37 edges
4. `Button()` - 29 edges
5. `formatCurrency()` - 26 edges
6. `Proceso de Certificación para ser Emisor Electrónico` - 26 edges
7. `FacturaService` - 24 edges
8. `Descripción Técnica Servicios DGII` - 24 edges
9. `CotizacionService` - 23 edges
10. `Formato Comprobante Fiscal Electrónico (e-CF) V1.0` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Firma Digital (XML Signature de e-CF)` --semantically_similar_to--> `Firmado de XML (SHA-256)`  [INFERRED] [semantically similar]
  e-cf/Firmado de e-CF.pdf → e-cf/Descripcion_20Tecnica_20Emisores_20Electronicos.pdf
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `bootstrap()` --indirect_call--> `CategoriaMaterial`  [INFERRED]
  backend/src/database/seed.ts → backend/src/categoria-material/entities/categoria-material.entity.ts
- `computeTotalesCategorizados()` --indirect_call--> `linea()`  [INFERRED]
  backend/src/common/totales/totales.util.ts → backend/src/common/totales/totales.util.spec.ts
- `bootstrap()` --indirect_call--> `Material`  [INFERRED]
  backend/src/database/seed.ts → backend/src/material/entities/material.entity.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Delegación de Roles de Facturación Electrónica** — e_cf_instructivo_facturador_gratuito_de_fe_1_contribuyente, e_cf_instructivo_facturador_gratuito_de_fe_1_representante, e_cf_instructivo_facturador_gratuito_de_fe_1_delegado, e_cf_instructivo_facturador_gratuito_de_fe_1_rol_de_facturacion_electronica [EXTRACTED 1.00]
- **Emisión y Firma de e-CF ante DGII** — e_cf_instructivo_facturador_gratuito_de_fe_1_comprobante_fiscal_electronico, e_cf_instructivo_facturador_gratuito_de_fe_1_certificado_digital, e_cf_instructivo_facturador_gratuito_de_fe_1_e_ncf, e_cf_instructivo_facturador_gratuito_de_fe_1_dgii [EXTRACTED 1.00]
- **Verificación de Identidad y Firma para Certificado Digital** — e_cf_instructivo_facturador_gratuito_de_fe_1_junta_central_electoral, e_cf_instructivo_facturador_gratuito_de_fe_1_codigo_otp, e_cf_instructivo_facturador_gratuito_de_fe_1_viafirma, e_cf_instructivo_facturador_gratuito_de_fe_1_avansi [INFERRED 0.85]
- **Flujo de Declaración de Contingencia en OFV** — e_cf_instructivo_contingencia_fe_oficina_virtual, e_cf_instructivo_contingencia_fe_declaracion_entrada_contingencia, e_cf_instructivo_contingencia_fe_declaracion_salida_contingencia, e_cf_instructivo_contingencia_fe_historico_contingencias [EXTRACTED 1.00]
- **Flujo de Recepción y Validación de e-CF** — e_cf_descripcion_20tecnica_20servicios_20dgii_servicio_recepcion_ecf, e_cf_descripcion_20tecnica_20servicios_20dgii_trackid, e_cf_descripcion_20tecnica_20servicios_20dgii_servicio_consulta_resultado, e_cf_descripcion_20tecnica_20servicios_20dgii_servicio_consulta_estado [EXTRACTED 1.00]
- **Flujo de Reemplazo de Comprobantes Post-Contingencia** — e_cf_instructivo_contingencia_fe_declaracion_salida_contingencia, e_cf_instructivo_contingencia_fe_comprobante_no_electronico, e_cf_descripcion_20tecnica_20servicios_20dgii_servicio_recepcion_ecf [INFERRED 0.85]
- **Emisor Electrónico Certification Stages (Solicitud, Set de Pruebas, Certificación)** — solicitud_ser_emisor_electronico, set_pruebas, certificacion_final [EXTRACTED 1.00]
- **e-CF Emisor-DGII-Receptor Operating Model** — dgii, emisor_electronico, receptor_electronico [EXTRACTED 1.00]
- **Prerequisites for Facturación Electrónica Certification (RNC, OFV, Certificado Digital)** — rnc, oficina_virtual, certificado_digital [INFERRED 0.85]
- **Flujo de Delegación de Roles y Firma Digital de e-CF** — e_cf_instructivo_delegaciones_de_roles_de_facturaci_n_electr_nica_delegado, e_cf_instructivo_delegaciones_de_roles_de_facturaci_n_electr_nica_rol_firmante, e_cf_instructivo_delegaciones_de_roles_de_facturaci_n_electr_nica_app_de_firma, e_cf_firmado_de_e_cf_firma_digital [INFERRED 0.75]
- **Proceso de Certificación de Emisor Electrónico (3 etapas)** — e_cf_pliego_de_condiciones_etapa_solicitud, e_cf_pliego_de_condiciones_etapa_set_pruebas, e_cf_pliego_de_condiciones_declaracion_jurada, e_cf_pliego_de_condiciones_etapa_certificacion [EXTRACTED 1.00]
- **Tríada de Servicios Web del Receptor Electrónico** — e_cf_descripcion_20tecnica_20emisores_20electronicos_url_autenticacion, e_cf_descripcion_20tecnica_20emisores_20electronicos_url_recepcion, e_cf_descripcion_20tecnica_20emisores_20electronicos_url_aprobacion_comercial [EXTRACTED 1.00]
- **e-CF Submission and Response Workflow (Envío, Acuse de Recibo, Aprobación Comercial, Anulación)** — e_cf_proceso_certificacion_emisorelectronico_proveedor_servicios_fecertificado_envio_e_cf, e_cf_formato_acuse_de_recibo_v_1_0_formato_acuse_recibo_arecf, e_cf_formato_aprobaci_n_comercial_v1_0_formato_aprobacion_comercial_acecf, e_cf_formato_anulaci_n_de_e_ncf_v1_0_formato_anulacion_e_ncf_anecf [INFERRED 0.85]
- **Digital Signature Requirement Across e-CF Response Formats** — e_cf_instructivo_20app_20firma_20digital_app_firma_digital, e_cf_instructivo_20app_20firma_20digital_firma_digital, e_cf_formato_anulaci_n_de_e_ncf_v1_0_firma_digital_anecf, e_cf_formato_20resumen_20factura_20consumo_20electr_c3_b3nica_20v1_0_firma_digital_rfce, e_cf_formato_aprobaci_n_comercial_v1_0_firma_digital_acecf, e_cf_formato_acuse_de_recibo_v_1_0_firma_digital_arecf [INFERRED 0.85]
- **Core Actors in the e-CF Ecosystem (Emisor, Receptor, DGII)** — e_cf_proceso_certificacion_emisorelectronico_proveedor_servicios_fecertificado_emisor_electronico, e_cf_proceso_certificacion_emisorelectronico_proveedor_servicios_fecertificado_receptor_electronico, e_cf_proceso_certificacion_emisorelectronico_proveedor_servicios_fecertificado_impuestos_internos_dgii [INFERRED 0.85]

## Communities (67 total, 12 thin omitted)

### Community 0 - "Client & Vehicle Management"
Cohesion: 0.12
Nodes (16): Empresa, EstadoDgii, DgiiAuthService, RespuestaAutenticacion, getAmbienteDgii(), postXmlMultipart(), resolveAmbienteSegmento(), DgiiPollingService (+8 more)

### Community 1 - "Authentication & User Roles"
Cohesion: 0.05
Nodes (18): AppController, AppService, AuthController, AuthService, TokenPair, Public(), LoginDto, CreateRolDto (+10 more)

### Community 2 - "DGII Web Services & Contingency"
Cohesion: 0.08
Nodes (56): Ambiente Certificación, Ambiente Pre-Certificación, Ambiente Producción, DGII / Impuestos Internos, Descripción Técnica Servicios DGII, e-NCF (Número de Comprobante Fiscal Electrónico), Facturador Electrónico, Formato Aprobación Comercial (ACECF) (+48 more)

### Community 3 - "Free Invoicing Tool (Facturador Gratuito)"
Cohesion: 0.05
Nodes (55): AVANSI (Entidad de Certificación), Certificado Digital, Certificado Digital Gratuito, Código de Seguridad, Código OTP, Código QR, Compras Electrónico (Tipo 41), Comprobante de Exportaciones Electrónico (+47 more)

### Community 4 - "e-CF Message Formats & Certification"
Cohesion: 0.06
Nodes (50): Comprador (RFCE), Encabezado (RFCE), Factura de Consumo Electrónica <DOP250,000 (Tipo 32), Firma Digital (sección RFCE), Formato de Resumen Factura de Consumo Electrónica (RFCE), Detalle de Acuse de Recibo, Estado de Acuse de Recibo (Recibido/No Recibido), Firma Digital (sección ARECF) (+42 more)

### Community 5 - "Material & Inventory Catalog"
Cohesion: 0.07
Nodes (28): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+20 more)

### Community 6 - "Digital Signing & Role Delegation"
Cohesion: 0.05
Nodes (48): Acuse de Recibo (formato XML), DGII (Dirección General de Impuestos Internos), e-CF / e-NCF (Comprobante Fiscal Electrónico), Emisor Electrónico, Estándar de Nombre de Archivos XML, Firmado de XML (SHA-256), Receptor Electrónico, Restricciones de Contenido y Caracteres en los XML (+40 more)

### Community 7 - "Work Orders & JWT Auth"
Cohesion: 0.17
Nodes (13): emptyLinea(), LineaItemDraft, LineItemsEditor(), LineItemsEditorProps, QuoteFormProps, QuoteFormSubmitPayload, QuoteFormValues, schema (+5 more)

### Community 8 - "Inventory Movements & Suppliers"
Cohesion: 0.06
Nodes (35): dependencies, axios, react, react-dom, react-router-dom, tailwindcss, @tailwindcss/vite, zod (+27 more)

### Community 9 - "Quotes (Cotizaciones)"
Cohesion: 0.06
Nodes (20): CotizacionController, COTIZACION_RELATIONS, CotizacionService, CreateCotizacionDto, CreateCotizacionLineaDto, UpdateCotizacionDto, UpdateCotizacionLineaDto, Cotizacion (+12 more)

### Community 10 - "Backend Dev Dependencies"
Cohesion: 0.20
Nodes (14): computeMontoItem(), formatMonto(), Factura, EcfXmlBuilderService, XmlNode, assertIndicadoresAsignados(), assertMaxLength(), computeTotalesEcf() (+6 more)

### Community 11 - "e-CF Technical Norms & Services"
Cohesion: 0.10
Nodes (23): Aprobación o Rechazo Comercial, Código de Seguridad, Código Tributario (Ley 11-92), Operación en Contingencia, Decreto 587-24 (Reglamento de Aplicación de la Ley 32-23), Informe Técnico Comprobante Fiscal Electrónico v1.0, Norma General 03-08 (Bonos o Certificados de Regalo), Norma General 05-2019 (+15 more)

### Community 12 - "Insurance Companies (Aseguradora)"
Cohesion: 0.07
Nodes (15): AseguradoraController, AseguradoraService, CreateAseguradoraDto, UpdateAseguradoraDto, Aseguradora, ClienteController, ClienteService, CreateClienteDto (+7 more)

### Community 13 - "Vehicle Parts (Pieza)"
Cohesion: 0.14
Nodes (10): CreateFacturaDto, CreateFacturaFromCotizacionDto, CreateFacturaLineaDto, RegistrarPagoDto, UpdateFacturaDto, UpdateFacturaLineaDto, EstadoFactura, TipoECF (+2 more)

### Community 16 - "TypeScript Compiler Config"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 17 - "e-CF Format & Tax Tables"
Cohesion: 0.11
Nodes (20): Comprobante Electrónico de Compras (Tipo 41), Comprobante Electrónico para Exportaciones (Tipo 46), Comprobante Electrónico para Gastos Menores (Tipo 43), Comprobante Electrónico Gubernamental (Tipo 45), Comprobante Electrónico para Pagos al Exterior (Tipo 47), Comprobante Electrónico para Regímenes Especiales (Tipo 44), Decreto No. 254-06 (Reglamento Impresión, Emisión y Entrega de Comprobantes Fiscales), Comprobante Fiscal Electrónico (e-CF) (+12 more)

### Community 18 - "Electronic Issuer Certification"
Cohesion: 0.13
Nodes (18): Acuse de Recibo, Ambiente de Certificación, Ambiente de Pre-Certificación, Certificación (Autorización como Emisor Electrónico), Código QR del e-CF, Dirección General de Impuestos Internos (DGII), Proceso de Certificación para ser Emisor Electrónico, Número de Comprobante Fiscal Electrónico (e-NCF) (+10 more)

### Community 19 - "Backend Runtime Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, class-transformer, class-validator, cookie-parser, @nestjs/common, @nestjs/config, @nestjs/core (+15 more)

### Community 20 - "Backend NPM Scripts"
Cohesion: 0.11
Nodes (18): scripts, build, format, lint, migration:generate, migration:revert, migration:run, seed (+10 more)

### Community 21 - "Company Profile (Empresa)"
Cohesion: 0.14
Nodes (11): CODIGOS_MUNICIPIO, CODIGOS_PROVINCIA, CODIGOS_VALIDOS, DIVISIONES_TERRITORIALES, DivisionTerritorial, esCodigoDivisionTerritorialValido(), NivelDivisionTerritorial, UpsertEmpresaDto (+3 more)

### Community 22 - "Admin User Request for e-CF"
Cohesion: 0.18
Nodes (15): Centro de Asistencia Presencial (CAP), Certificado Digital para Procedimiento Tributario, Declaración Jurada para la Actualización de Datos de Sociedades, Declaración Jurada de Certificación (Paso 13), Digifirma (Entidad de Certificación), Solicitud Usuario Administrador de e-CF, Firma Digital, Signatario o Firmante de e-CF (+7 more)

### Community 23 - "App Bootstrap & Auth Guards"
Cohesion: 0.14
Nodes (17): AseguradoraModule, AuthModule, JwtAuthGuard, RolesGuard, ClienteModule, CotizacionModule, FacturaModule, FacturacionElectronicaModule (+9 more)

### Community 24 - "Jest Test Config"
Cohesion: 0.22
Nodes (6): Roles(), CreateSecuenciaNcfDto, SecuenciaNcf, SecuenciaNcfController, SecuenciaNcfModule, SecuenciaNcfService

### Community 25 - "NestJS CLI Config"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 26 - "Package Metadata"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 27 - "Agent Governance Rules"
Cohesion: 0.16
Nodes (6): CategoriaMaterialModule, CreateMaterialDto, UpdateMaterialDto, Material, MaterialController, MaterialService

### Community 32 - "TecnicoService"
Cohesion: 0.08
Nodes (18): JwtPayload, CreateOrdenTrabajoAsignacionDto, CreateOrdenTrabajoConsumoDto, CreateOrdenTrabajoDto, UpdateOrdenTrabajoConsumoDto, UpdateOrdenTrabajoDto, OrdenTrabajoAsignacion, OrdenTrabajoConsumo (+10 more)

### Community 33 - "Invoice.tsx"
Cohesion: 0.09
Nodes (47): App(), DocumentHeader(), DocumentHeaderProps, LineItemRow, LineItemsTable(), Field, PartyCard(), PartyCardProps (+39 more)

### Community 35 - "Consumer Invoice Summary Rules"
Cohesion: 0.67
Nodes (3): Factura de Consumo Electrónica (Tipo 32), Factura de Consumo Electrónica menor a DOP$250 mil, Resumen de Factura de Consumo Electrónica (RFCE)

### Community 36 - "Backend README"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 37 - "icons.tsx"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 41 - "Frontend Entry Point"
Cohesion: 0.09
Nodes (27): Layout(), RequireAdmin(), Topbar(), ThemeToggle(), AuthProvider(), getInitialTheme(), Theme, ThemeContext (+19 more)

### Community 42 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 43 - "InvoiceList.tsx"
Cohesion: 0.15
Nodes (7): CurrentUser, JwtStrategy, CreateMovimientoInventarioDto, MovimientoInventario, MovimientoInventarioController, MOVIMIENTO_RELATIONS, MovimientoInventarioService

### Community 44 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 45 - "app.controller.ts"
Cohesion: 0.21
Nodes (15): calcularTotales(), CategoriaTotales, computeTotalesCategorizados(), INDICADORES_DESCONTABLES, LineaCalculable, MotivoDescuentoInvalido, OpcionesTotales, parseMonto() (+7 more)

### Community 46 - "icons.tsx"
Cohesion: 0.15
Nodes (24): NewClientModal(), Sidebar(), base, IconCatalog(), IconClose(), IconCustomers(), IconInventory(), IconInvoice() (+16 more)

### Community 47 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 50 - "AddInventoryCatalog1783024534404"
Cohesion: 0.20
Nodes (5): CategoriaMaterialController, CategoriaMaterialService, CreateCategoriaMaterialDto, UpdateCategoriaMaterialDto, CategoriaMaterial

### Community 51 - "mockData.ts"
Cohesion: 0.25
Nodes (7): CatalogoColumn, CatalogoSection(), CatalogoSectionProps, IconTrash(), UsuarioModal(), UsersList(), usuarioService

### Community 52 - "useDataStore"
Cohesion: 0.14
Nodes (13): 1. Build the invoice internally, 2. Assign the e-NCF, 3. Build the full `<ECF>` XML, 4. Sign the full e-CF, 5. The path splits: full e-CF vs. RFCE, 5a. Full e-CF path, 5b. RFCE path, 6. Persist the result (+5 more)

### Community 53 - "AseguradoraService"
Cohesion: 0.18
Nodes (9): EditWorkOrderModal(), ReasignarTecnicoModal(), SearchableSelectOption, SearchableSelectProps, IconChevronDown(), estadoDotClass, estadoLabels, EstadoMenuProps (+1 more)

### Community 54 - "ProveedorService"
Cohesion: 0.18
Nodes (6): CreateProveedorDto, UpdateProveedorDto, Proveedor, ProveedorController, ProveedorModule, ProveedorService

### Community 55 - "index.ts"
Cohesion: 0.09
Nodes (30): NewMovimientoModalProps, schema, UsuarioModalProps, CategoriaMaterial, categoriaMaterialService, CreateCategoriaMaterialDto, UpdateCategoriaMaterialDto, CreateClienteDto (+22 more)

### Community 56 - "cotizacion.ts"
Cohesion: 0.10
Nodes (23): AseguradoraModal(), PiezaModal(), PiezaModalProps, schema, schema, ServicioModal(), ServicioModalProps, EMPRESA_POR_DEFECTO (+15 more)

### Community 57 - "PiezaService"
Cohesion: 0.23
Nodes (11): TipoIdentificacion, FacturaLinea, IndicadorFacturacion, childOrder(), elementText(), makeCliente(), makeEmpresa(), makeFactura() (+3 more)

### Community 58 - "crud.ts"
Cohesion: 0.17
Nodes (11): 1. Compute — where the NestJS backend runs, 2. Database — Postgres, 3. Secrets — the DGII digital certificate (`.p12`) and its password, 4. TLS / DNS — public HTTPS for the app and for DGII to call back into, 5. Frontend hosting (React/Vite SPA), 6. File storage — retained e-CF/RFCE XML, 7. Background jobs (token refresh, TrackId polling, contingency resubmission), 8. Monitoring & logs (+3 more)

### Community 59 - "factura.ts"
Cohesion: 0.08
Nodes (36): EditVehiculoModalProps, EditWorkOrderModalProps, NewVehiculoModalProps, METODOS_PAGO, RegistrarPagoModal(), RegistrarPagoModalProps, schema, VehiculoPickerProps (+28 more)

### Community 60 - "ordenTrabajo.ts"
Cohesion: 0.17
Nodes (11): 10. Quick reference — exactly what DGII mandates, 1. XML fundamentals (just enough to be dangerous), 2. XSD — XML Schema Definition, 3. Canonicalization (C14N), 4. Cryptographic hashing (digests), 5. Public-key (asymmetric) cryptography, 6. Digital certificates & X.509, 7. PKCS#12 (`.p12`/`.pfx`) and PEM (+3 more)

### Community 62 - "vehiculo.ts"
Cohesion: 0.09
Nodes (41): AseguradoraModalProps, schema, schema, schema, Field(), FormError(), schema, NewTecnicoModal() (+33 more)

### Community 63 - "AppModule"
Cohesion: 0.14
Nodes (13): AppModule, bootstrap(), MATERIALES, MaterialSeed, PIEZAS, ROLES, seedAdminUser(), seedMateriales() (+5 more)

### Community 65 - "AddInventoryCatalog1783024534404"
Cohesion: 0.04
Nodes (13): dataSourceOptions, InitSchema1782869686899, AddInventoryCatalog1783024534404, AddAseguradora1783025395234, AddOrdenTrabajo1783046143655, AddFactura1783108899928, AddEsAseguradoraToCliente1783268122550, EnumCotizacionEstado1783658017852 (+5 more)

## Knowledge Gaps
- **435 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `plugins` (+430 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Backend Runtime Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `typeorm` connect `Backend Runtime Dependencies` to `AddInventoryCatalog1783024534404`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `api` connect `Frontend Entry Point` to `cotizacion.ts`, `factura.ts`, `index.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _438 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Client & Vehicle Management` be split into smaller, more focused modules?**
  _Cohesion score 0.11738648947951273 - nodes in this community are weakly interconnected._
- **Should `Authentication & User Roles` be split into smaller, more focused modules?**
  _Cohesion score 0.054340396445659606 - nodes in this community are weakly interconnected._
- **Should `DGII Web Services & Contingency` be split into smaller, more focused modules?**
  _Cohesion score 0.07857142857142857 - nodes in this community are weakly interconnected._