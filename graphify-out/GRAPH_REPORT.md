# Graph Report - vyrko  (2026-08-29)

## Corpus Check
- 297 files · ~70,369 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2156 nodes · 4497 edges · 164 communities (97 shown, 67 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 91 edges (avg confidence: 0.83)
- Token cost: 429,275 input · 0 output

## Community Hubs (Navigation)
- Work Order & Payment UI
- Catalog & Vehicle Form Modals
- XML-DSig Signing Study Guide
- Empresa & Territorial Catalog
- User & Profile Editing UI
- Cliente API Module
- Proveedor API Module
- Cotizacion Service & Modal Props
- UI Icons & Work Order Page
- Servicio API Module
- Tecnico API Module
- e-CF Factura Entities & Indicators
- Orden de Trabajo DTOs
- Auth & Theme Context (Frontend)
- DGII e-CF Submission Services
- Secuencia NCF Module
- Line Item Editor UI
- Inventory Movement Module
- DGII Auth, Polling & Estado
- Orden de Trabajo Entities
- Auth & Usuario Service
- Rol Module
- Pieza Module
- e-CF XML Builder & RFCE
- Factura DTOs
- Frontend tsconfig (app)
- Backend Dependencies
- Backend Feature Modules
- Backend tsconfig
- Backend Module Wiring
- Factura Controller
- Factura Service
- Cotizacion DTOs & Estado
- Cotizacion Entities
- Orden de Trabajo Core
- Frontend tsconfig (node)
- Usuario Controller
- Totales Calculation Utility
- Usuario DTOs
- Backend Package Scripts
- Cotizacion Controller
- Material Service
- Frontend Dependencies
- Babel Dev Dependencies
- Aseguradora Service & Entities
- Vehiculo Service
- Auth Controller & Login DTO
- Cotizacion Service Core
- Aseguradora Controller
- Categoria Material Service
- Categoria Material Entities
- Material Controller
- Pieza Controller
- Rol Controller
- Vehiculo Controller
- e-CF Firmado (Signing Spec)
- Factura Update DTO & Estado
- Orden de Trabajo Enums
- DGII Contingency & Certification
- New Material Modal UI
- Backend Jest Config
- DGII e-CF Format Specs
- DGII Resumen Factura Consumo Spec
- DGII Delegacion de Roles Spec
- App Controller & Service
- Database Seeding
- Material DTOs
- DGII Acuse & Aprobacion Formats
- DGII Informe Tecnico e-CF
- DGII Facturador Gratuito Process
- Cotizacion Create DTO
- Cotizacion Update DTO
- Factura Create DTO (validators)
- Vehiculo DTOs
- Emisor Electronico Certification
- Representacion Impresa Spec
- Aseguradora DTOs
- Categoria Material DTOs
- Frontend Package Manifest
- New Tecnico Modal UI
- New Invoice Page & Totales
- DGII Servicios Tecnica Spec
- Inventory Movement Entity
- Backend tsconfig.build
- Color Palette Design Tokens
- DGII Emisores Tecnica Spec
- NestJS CLI Config
- Backend Package Metadata
- Backend ESLint Dependencies
- JWT Guard & Public Decorator
- Roles Guard & Decorator
- Factura Create DTO
- DGII Comprobante Fiscal Format
- DGII App Firma Digital Spec
- App Bootstrap (main)
- DGII Certification Misc
- JWT Strategy
- Database Migration 1782869686899
- Database Migration 1783024534404
- Database Migration 1783025395234
- Database Migration 1783043552605
- Database Migration 1783046143655
- Database Migration 1783051968531
- Database Migration 1783108899928
- Database Migration 1783268122550
- Database Migration 1783658017852
- Database Migration 1783703270455
- Database Migration 1783799540998
- Database Migration 1786046720938
- Database Migration 1786069197917
- Database Migration 1786069785459
- Database Migration 1786485253676
- DGII Certification Conditions
- Nang Yang Logo Asset
- Frontend tsconfig Root
- babel-plugin-react-compiler
- class-validator Dependency
- @nestjs/common Dependency
- @nestjs/config Dependency
- @nestjs/core Dependency
- @nestjs/mapped-types Dependency
- @nestjs/passport Dependency
- @nestjs/schedule Dependency
- @nestjs/typeorm Dependency
- node-forge Dependency
- passport-jwt Dependency
- rxjs Dependency
- eslint-config-prettier Dependency
- @eslint/eslintrc Dependency
- @eslint/js Dependency
- globals Dependency
- jest Dependency
- @nestjs/cli Dependency
- @nestjs/schematics Dependency
- @nestjs/swagger Dependency
- @nestjs/testing Dependency
- prettier Dependency
- source-map-support Dependency
- supertest Dependency
- ts-jest Dependency
- ts-loader Dependency
- ts-node Dependency
- tsconfig-paths Dependency
- @types/express Dependency
- @types/jest Dependency
- @types/node Dependency
- @types/node-forge Dependency
- @types/passport-jwt Dependency
- @types/supertest Dependency
- typescript Dependency
- typescript-eslint Dependency
- TypeORM Data Source
- eslint-plugin-react-hooks Dependency
- eslint-plugin-react-refresh Dependency
- rolldown-plugin-babel Dependency
- @types/react Dependency
- typescript (Frontend) Dependency
- vite Dependency
- @vitejs/plugin-react Dependency
- Favicon Brand Mark
- AWS Route 53 Deployment Note

## God Nodes (most connected - your core abstractions)
1. `useApiList()` - 49 edges
2. `Factura` - 45 edges
3. `formatCurrency()` - 34 edges
4. `Button()` - 29 edges
5. `Usuario` - 27 edges
6. `OrdenTrabajo` - 26 edges
7. `FacturaService` - 25 edges
8. `CotizacionService` - 24 edges
9. `Cotizacion` - 24 edges
10. `Empresa` - 23 edges

## Surprising Connections (you probably didn't know these)
- `XSD Positional (xs:sequence) Validation` --semantically_similar_to--> `Full e-CF XML Build`  [INFERRED] [semantically similar]
  docs/XML_SIGNING_STUDY_GUIDE.md → backend/ECF_GENERATION_FLOW.md
- `Graphify Knowledge Graph Workflow` --conceptually_related_to--> `e-CF Generation Pipeline`  [AMBIGUOUS]
  CLAUDE.md → backend/ECF_GENERATION_FLOW.md
- `CloudWatch Logs & Alarms` --references--> `Full e-CF Submission Path (tipo 31 / tipo 32 >= RD$250k)`  [INFERRED]
  docs/AWS_DEPLOYMENT.md → backend/ECF_GENERATION_FLOW.md
- `In-process @nestjs/schedule Background Jobs` --references--> `DGII Authentication (semilla / token)`  [INFERRED]
  docs/AWS_DEPLOYMENT.md → backend/ECF_GENERATION_FLOW.md
- `In-process @nestjs/schedule Background Jobs` --references--> `TrackId Result Polling (Consulta de Resultado)`  [INFERRED]
  docs/AWS_DEPLOYMENT.md → backend/ECF_GENERATION_FLOW.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **e-CF Generation Pipeline End-to-End Flow** — backend_ecf_generation_flow_encf_assignment, backend_ecf_generation_flow_full_ecf_xml_build, backend_ecf_generation_flow_ecf_signing, backend_ecf_generation_flow_path_split, backend_ecf_generation_flow_full_ecf_path, backend_ecf_generation_flow_rfce_path, backend_ecf_generation_flow_persist_result [EXTRACTED 1.00]
- **XML-DSig Signing Stack for e-CF** — docs_xml_signing_study_guide_xml_dsig, docs_xml_signing_study_guide_canonicalization, docs_xml_signing_study_guide_sha256, docs_xml_signing_study_guide_rsa_sha256, docs_xml_signing_study_guide_x509_certificate, docs_xml_signing_study_guide_enveloped_signature, docs_xml_signing_study_guide_ecf_signer_service [EXTRACTED 0.90]
- **Right-Sized Minimal AWS Deployment Stack** — docs_aws_deployment_ec2_compute, docs_aws_deployment_rds_postgres, docs_aws_deployment_ssm_parameter_store, docs_aws_deployment_tls_certbot_nginx, docs_aws_deployment_s3_cloudfront_frontend, docs_aws_deployment_cloudwatch [EXTRACTED 0.90]
- **Flujo de emision, recepcion DGII y consulta de estado del e-CF** — e_cf_descripcion_20tecnica_20servicios_20dgii_autenticacion_service, e_cf_descripcion_20tecnica_20servicios_20dgii_token_autenticacion, e_cf_descripcion_20tecnica_20servicios_20dgii_recepcion_ecf_service, e_cf_descripcion_20tecnica_20servicios_20dgii_trackid, e_cf_descripcion_20tecnica_20servicios_20dgii_consulta_resultado_ecf_service, e_cf_informe_t_cnico_e_cf_v1_0_ecf_estados [EXTRACTED 1.00]
- **Componentes de la firma XML-DSig enveloped del e-CF** — e_cf_firmado_de_e_cf_xml_signature, e_cf_firmado_de_e_cf_canonicalization_c14n, e_cf_firmado_de_e_cf_signaturemethod, e_cf_firmado_de_e_cf_enveloped_signature_transform, e_cf_firmado_de_e_cf_digestmethod, e_cf_firmado_de_e_cf_digestvalue, e_cf_firmado_de_e_cf_signaturevalue, e_cf_firmado_de_e_cf_keyinfo_x509 [EXTRACTED 1.00]
- **Composicion en secciones del XML del e-CF** — e_cf_formato_comprobante_fiscal_electr_nico_e_cf_v1_0_ecf_encabezado, e_cf_formato_comprobante_fiscal_electr_nico_e_cf_v1_0_ecf_detalle_bienes_servicios, e_cf_formato_comprobante_fiscal_electr_nico_e_cf_v1_0_ecf_subtotales_informativos, e_cf_formato_comprobante_fiscal_electr_nico_e_cf_v1_0_ecf_descuentos_recargos, e_cf_formato_comprobante_fiscal_electr_nico_e_cf_v1_0_ecf_paginacion, e_cf_formato_comprobante_fiscal_electr_nico_e_cf_v1_0_ecf_informacion_referencia, e_cf_firmado_de_e_cf_xml_signature [EXTRACTED 1.00]
- **Etapas del Proceso de Certificación para ser Emisor Electrónico** — e_cf_proceso_de_certificacion_para_ser_emisor_electronico_proceso_de_certificacion_emisor_electronico, e_cf_proceso_de_certificacion_para_ser_emisor_electronico_etapa_de_solicitud, e_cf_proceso_de_certificacion_para_ser_emisor_electronico_formulario_solicitud_emisor_electronico_fi_gdf_016, e_cf_proceso_de_certificacion_para_ser_emisor_electronico_etapa_de_set_de_pruebas, e_cf_proceso_de_certificacion_para_ser_emisor_electronico_postulacion_para_ser_emisor_electronico, e_cf_pliego_de_condiciones_declaracion_jurada_certificacion, e_cf_proceso_de_certificacion_para_ser_emisor_electronico_etapa_de_certificacion [EXTRACTED 0.95]
- **Roles de Facturación Electrónica en la Delegación de Roles** — e_cf_instructivo_delegaciones_de_roles_de_facturaci_n_electr_nica_delegacion_de_roles_fe, e_cf_instructivo_delegaciones_de_roles_de_facturaci_n_electr_nica_rol_de_administrador, e_cf_instructivo_delegaciones_de_roles_de_facturaci_n_electr_nica_rol_de_firmante, e_cf_instructivo_delegaciones_de_roles_de_facturaci_n_electr_nica_rol_de_aprobador_comercial, e_cf_instructivo_delegaciones_de_roles_de_facturaci_n_electr_nica_rol_de_solicitante, e_cf_instructivo_delegaciones_de_roles_de_facturaci_n_electr_nica_delegado [EXTRACTED 0.95]
- **Flujo del Estado de Contingencia de Facturación Electrónica** — e_cf_instructivo_contingencia_fe_estado_de_contingencia, e_cf_instructivo_contingencia_fe_contingencia_total, e_cf_instructivo_contingencia_fe_contingencia_parcial, e_cf_instructivo_contingencia_fe_declaracion_entrada_en_contingencia, e_cf_instructivo_contingencia_fe_declaracion_salida_de_contingencia, e_cf_instructivo_contingencia_fe_comprobante_fiscal_no_electronico_serie_b [EXTRACTED 0.95]

## Communities (164 total, 67 thin omitted)

### Community 0 - "Work Order & Payment UI"
Cohesion: 0.06
Nodes (51): App(), DocumentHeader(), DocumentHeaderProps, LineItemRow, LineItemsTable(), Field, PartyCard(), PartyCardProps (+43 more)

### Community 1 - "Catalog & Vehicle Form Modals"
Cohesion: 0.09
Nodes (48): AseguradoraModalProps, schema, CatalogoColumn, CatalogoSectionProps, schema, schema, schema, schema (+40 more)

### Community 2 - "XML-DSig Signing Study Guide"
Cohesion: 0.06
Nodes (50): CodigoSeguridadeCF Derivation, DGII Authentication (semilla / token), DgiiAuthService / EcfSubmissionService (Phase 3, planned), e-CF Generation Pipeline, EcfSignerService, e-CF Signing (before path split), EcfXmlBuilderService, ecf-xml.util.ts Shared Tax-Bucket Aggregation (+42 more)

### Community 3 - "Empresa & Territorial Catalog"
Cohesion: 0.06
Nodes (31): CODIGOS_MUNICIPIO, CODIGOS_PROVINCIA, CODIGOS_VALIDOS, DIVISIONES_TERRITORIALES, DivisionTerritorial, NivelDivisionTerritorial, IsEmail, IsIn (+23 more)

### Community 4 - "User & Profile Editing UI"
Cohesion: 0.08
Nodes (33): EditVehiculoModal(), handleSubmit(), schema, UsuarioModal(), handleSubmit(), UsuarioModalProps, api, rawApi (+25 more)

### Community 5 - "Cliente API Module"
Cohesion: 0.07
Nodes (29): ClienteController, ApiBearerAuth, Body, Controller, Delete, Get, Param, Patch (+21 more)

### Community 6 - "Proveedor API Module"
Cohesion: 0.08
Nodes (25): CreateProveedorDto, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, UpdateProveedorDto, Proveedor (+17 more)

### Community 7 - "Cotizacion Service & Modal Props"
Cohesion: 0.07
Nodes (41): PiezaModalProps, ServicioModalProps, EditVehiculoModalProps, EditWorkOrderModalProps, NewVehiculoModalProps, QuoteFormSubmitPayload, RegistrarPagoModalProps, VehiculoPickerProps (+33 more)

### Community 8 - "UI Icons & Work Order Page"
Cohesion: 0.09
Nodes (32): EditWorkOrderModal(), NewClientModal(), ReasignarTecnicoModal(), Sidebar(), base, IconCatalog(), IconChevronDown(), IconClose() (+24 more)

### Community 9 - "Servicio API Module"
Cohesion: 0.08
Nodes (25): CreateServicioDto, IsBoolean, IsNotEmpty, IsNumberString, IsOptional, IsString, UpdateServicioDto, Servicio (+17 more)

### Community 10 - "Tecnico API Module"
Cohesion: 0.08
Nodes (24): CreateTecnicoDto, IsBoolean, IsNotEmpty, IsOptional, IsString, UpdateTecnicoDto, Tecnico, Column (+16 more)

### Community 11 - "e-CF Factura Entities & Indicators"
Cohesion: 0.09
Nodes (31): TipoIdentificacion, CEDULA, NINGUNA, RNC, FacturaLinea, Column, CreateDateColumn, Entity (+23 more)

### Community 12 - "Orden de Trabajo DTOs"
Cohesion: 0.09
Nodes (31): CreateOrdenTrabajoAsignacionDto, IsOptional, IsString, IsUUID, CreateOrdenTrabajoConsumoDto, IsNumberString, IsUUID, CreateOrdenTrabajoDto (+23 more)

### Community 13 - "Auth & Theme Context (Frontend)"
Cohesion: 0.09
Nodes (24): Layout(), RequireAdmin(), Topbar(), ThemeToggle(), AuthProvider(), getInitialTheme(), Theme, ThemeContext (+16 more)

### Community 14 - "DGII e-CF Submission Services"
Cohesion: 0.09
Nodes (21): Factura, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+13 more)

### Community 15 - "Secuencia NCF Module"
Cohesion: 0.08
Nodes (24): CreateSecuenciaNcfDto, IsDateString, IsEnum, IsInt, ValidateIf, SecuenciaNcf, Column, CreateDateColumn (+16 more)

### Community 16 - "Line Item Editor UI"
Cohesion: 0.09
Nodes (24): AseguradoraModal(), CatalogoSection(), PiezaModal(), ServicioModal(), emptyLinea(), LineaItemDraft, autoLabel(), computeItbis() (+16 more)

### Community 17 - "Inventory Movement Module"
Cohesion: 0.09
Nodes (23): CurrentUser, JwtPayload, CreateMovimientoInventarioDto, IsIn, IsNumberString, IsOptional, IsString, IsUUID (+15 more)

### Community 18 - "DGII Auth, Polling & Estado"
Cohesion: 0.10
Nodes (23): EstadoDgii, ACEPTADO, ACEPTADO_CONDICIONAL, EN_PROCESO, ENVIADO, RECHAZADO, RespuestaAutenticacion, DGII_ECF_HOST (+15 more)

### Community 19 - "Orden de Trabajo Entities"
Cohesion: 0.08
Nodes (26): OrdenTrabajoAsignacion, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OrdenTrabajoConsumo (+18 more)

### Community 20 - "Auth & Usuario Service"
Cohesion: 0.11
Nodes (14): AuthService, TokenPair, Injectable, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne (+6 more)

### Community 21 - "Rol Module"
Cohesion: 0.13
Nodes (15): CreateRolDto, IsNotEmpty, IsString, UpdateRolDto, Rol, Column, CreateDateColumn, Entity (+7 more)

### Community 22 - "Pieza Module"
Cohesion: 0.14
Nodes (13): CreatePiezaDto, IsNotEmpty, IsString, UpdatePiezaDto, Pieza, Column, CreateDateColumn, Entity (+5 more)

### Community 23 - "e-CF XML Builder & RFCE"
Cohesion: 0.20
Nodes (13): formatMonto(), TotalesCategorizados, EcfXmlBuilderService, Injectable, assertIndicadoresAsignados(), assertMaxLength(), computeTotalesEcf(), esPagoCredito() (+5 more)

### Community 24 - "Factura DTOs"
Cohesion: 0.12
Nodes (18): CreateFacturaFromCotizacionDto, IsDateString, IsOptional, IsString, IsUUID, RegistrarPagoDto, IsDateString, IsNumberString (+10 more)

### Community 25 - "Frontend tsconfig (app)"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 26 - "Backend Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, class-transformer, cookie-parser, @nestjs/jwt, @nestjs/platform-express, passport, pg (+15 more)

### Community 27 - "Backend Feature Modules"
Cohesion: 0.15
Nodes (16): AseguradoraModule, Module, ClienteModule, Module, CotizacionModule, Module, FacturaModule, Module (+8 more)

### Community 28 - "Backend tsconfig"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 29 - "Backend Module Wiring"
Cohesion: 0.17
Nodes (16): AuthModule, Module, CategoriaMaterialModule, Module, MaterialModule, Module, MovimientoInventarioModule, Module (+8 more)

### Community 30 - "Factura Controller"
Cohesion: 0.20
Nodes (9): FacturaController, ApiBearerAuth, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 32 - "Cotizacion DTOs & Estado"
Cohesion: 0.21
Nodes (12): COTIZACION_RELATIONS, CreateCotizacionLineaDto, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID, UpdateCotizacionLineaDto (+4 more)

### Community 33 - "Cotizacion Entities"
Cohesion: 0.11
Nodes (19): InjectDataSource, InjectRepository, Cotizacion, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne (+11 more)

### Community 34 - "Orden de Trabajo Core"
Cohesion: 0.20
Nodes (10): OrdenTrabajoController, ApiBearerAuth, Body, Controller, CurrentUser, Delete, Get, Param (+2 more)

### Community 35 - "Frontend tsconfig (node)"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 36 - "Usuario Controller"
Cohesion: 0.19
Nodes (11): Roles(), ApiBearerAuth, Body, Controller, CurrentUser, Delete, Get, Param (+3 more)

### Community 37 - "Totales Calculation Utility"
Cohesion: 0.22
Nodes (15): calcularTotales(), CategoriaTotales, computeMontoItem(), computeTotalesCategorizados(), INDICADOR_NO_FACTURABLE, INDICADORES_DESCONTABLES, LineaCalculable, MotivoDescuentoInvalido (+7 more)

### Community 38 - "Usuario DTOs"
Cohesion: 0.17
Nodes (14): CreateUsuarioDto, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength, IsNotEmpty (+6 more)

### Community 39 - "Backend Package Scripts"
Cohesion: 0.11
Nodes (18): scripts, build, format, lint, migration:generate, migration:revert, migration:run, seed (+10 more)

### Community 40 - "Cotizacion Controller"
Cohesion: 0.19
Nodes (9): CotizacionController, ApiBearerAuth, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 41 - "Material Service"
Cohesion: 0.16
Nodes (11): Material, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn (+3 more)

### Community 42 - "Frontend Dependencies"
Cohesion: 0.12
Nodes (17): axios, dependencies, axios, react, react-dom, react-router-dom, tailwindcss, @tailwindcss/vite (+9 more)

### Community 43 - "Babel Dev Dependencies"
Cohesion: 0.12
Nodes (17): @babel/core, devDependencies, @babel/core, eslint, @eslint/js, globals, @types/babel__core, @types/node (+9 more)

### Community 44 - "Aseguradora Service & Entities"
Cohesion: 0.17
Nodes (9): AseguradoraService, Injectable, InjectRepository, Aseguradora, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn (+1 more)

### Community 45 - "Vehiculo Service"
Cohesion: 0.16
Nodes (11): Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Vehiculo (+3 more)

### Community 46 - "Auth Controller & Login DTO"
Cohesion: 0.21
Nodes (10): AuthController, Body, Controller, Post, LoginDto, IsString, MinLength, HttpCode (+2 more)

### Community 48 - "Aseguradora Controller"
Cohesion: 0.17
Nodes (9): AseguradoraController, ApiBearerAuth, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 49 - "Categoria Material Service"
Cohesion: 0.17
Nodes (9): CategoriaMaterialController, ApiBearerAuth, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 50 - "Categoria Material Entities"
Cohesion: 0.19
Nodes (9): CategoriaMaterialService, Injectable, InjectRepository, CategoriaMaterial, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn (+1 more)

### Community 51 - "Material Controller"
Cohesion: 0.17
Nodes (9): MaterialController, ApiBearerAuth, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 52 - "Pieza Controller"
Cohesion: 0.17
Nodes (9): PiezaController, ApiBearerAuth, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 53 - "Rol Controller"
Cohesion: 0.17
Nodes (9): RolController, ApiBearerAuth, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 54 - "Vehiculo Controller"
Cohesion: 0.17
Nodes (9): ApiBearerAuth, Body, Controller, Delete, Get, Param, Patch, Post (+1 more)

### Community 55 - "e-CF Firmado (Signing Spec)"
Cohesion: 0.17
Nodes (15): CanonicalizationMethod (xml-c14n-20010315), DigestMethod (xmlenc#sha256), DigestValue (sintesis Base64), Transform enveloped-signature, KeyInfo / X509Data / X509Certificate, Certificado digital PKCS#12 (.p12), Reference URI vacio (firma sobre todo el documento), Funcion criptografica SHA-256 (+7 more)

### Community 56 - "Factura Update DTO & Estado"
Cohesion: 0.16
Nodes (12): IsDateString, IsEnum, IsNumberString, IsOptional, IsString, IsUUID, UpdateFacturaDto, EstadoFactura (+4 more)

### Community 58 - "DGII Contingency & Certification"
Cohesion: 0.16
Nodes (14): Art. 40 Decreto 587-24 (límite 15 días calendario de contingencia), Comprobante Fiscal No Electrónico (Serie B), Contingencia Parcial, Declaración Entrada en Contingencia, Declaración Salida de Contingencia, Decreto 587-24 (Reglamento para la Aplicación de la Ley 32-23), Instructivo Contingencia FE, Estado de Contingencia (+6 more)

### Community 59 - "New Material Modal UI"
Cohesion: 0.22
Nodes (9): NewMaterialModal(), schema, CategoriaMaterial, categoriaMaterialService, CreateCategoriaMaterialDto, UpdateCategoriaMaterialDto, CreateMaterialDto, materialService (+1 more)

### Community 60 - "Backend Jest Config"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 61 - "DGII e-CF Format Specs"
Cohesion: 0.23
Nodes (13): Estandares como Emisor Electronico, Web Service Anulacion de e-NCF, Etiquetas madre de los formatos XML (ECF, ACECF, ARECF, ANECF, RFCE), Web Service Recepcion de Aprobacion Comercial, Formato Acuse de Recibo (ARECF), Encabezado de Anulacion de e-NCF (RncEmisor, CantidadeNCFAnulados, FechaHoraAnulacioneNCF), Formato Anulacion de e-NCF (ANECF), Formato Aprobacion Comercial (ACECF) (+5 more)

### Community 62 - "DGII Resumen Factura Consumo Spec"
Cohesion: 0.18
Nodes (13): Restricciones de Contenido y Caracteres en los XML, Web Service Consulta de Resumen de Factura de Consumo Electronica (ConsultaRFCE), Web Service Consulta Timbre FC (QR), Web Service Consulta Timbre (QR), Web Service Recepcion de Resumen Factura de Consumo Electronica (RFCE), Codigo de Seguridad e-CF (6 primeros caracteres del hash de la firma digital), Encabezado del RFCE (IdDoc, Emisor, Comprador, Totales), Formato de Resumen Factura de Consumo Electronica (RFCE) (+5 more)

### Community 63 - "DGII Delegacion de Roles Spec"
Cohesion: 0.22
Nodes (13): Aprobación o Rechazo de Roles, Carga XML Delegaciones, Delegación de Roles de Facturación Electrónica, Delegado, Instructivo Delegaciones de Roles de Facturación Electrónica, Rol de Administrador, Rol de Firmante, Solicitud Uso Facturador Gratuito (+5 more)

### Community 64 - "App Controller & Service"
Cohesion: 0.27
Nodes (6): AppController, Controller, Get, AppService, Injectable, Public()

### Community 65 - "Database Seeding"
Cohesion: 0.24
Nodes (11): bootstrap(), MATERIALES, MaterialSeed, PIEZAS, ROLES, seedAdminUser(), seedMateriales(), seedPiezas() (+3 more)

### Community 66 - "Material DTOs"
Cohesion: 0.29
Nodes (8): CreateMaterialDto, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID, UpdateMaterialDto

### Community 67 - "DGII Acuse & Aprobacion Formats"
Cohesion: 0.20
Nodes (12): Estandar de Nombre de Archivos XML (RNC+e-NCF), Campo Estado del Acuse de Recibo (0 Recibido / 1 No Recibido), Codigo Motivo No Recibido (1 Especificacion, 2 Firma Digital, 3 Duplicado, 4 RNC Comprador), Area Detalle Acuse de Recibo, Detalle de Anulacion / Tabla Rango Secuencias Anuladas de e-NCF, Campo Estado Aprobacion Comercial (1 e-CF Aceptado / 2 e-CF Rechazado), Area Detalle Aprobacion Comercial, Seccion Encabezado del e-CF (IdDoc, Emisor, Comprador, Totales) (+4 more)

### Community 68 - "DGII Informe Tecnico e-CF"
Cohesion: 0.18
Nodes (12): Ambientes de Facturacion Electronica (Pre-Certificacion, Certificacion, Produccion), Web Service Comunicacion Emisor-Receptor, Web Service Consulta Estatus Servicios, Arquitectura API REST XML de Facturacion Electronica, Documento Swagger / OpenAPI por ambiente, Actores del Sistema de Facturacion Electronica, Direccion General de Impuestos Internos (DGII), Emisor Electronico (+4 more)

### Community 69 - "DGII Facturador Gratuito Process"
Cohesion: 0.21
Nodes (12): Contingencia Total, Rol de Solicitante, Instructivo Facturador Gratuito de FE, Facturador Gratuito (FG) de Facturación Electrónica, Número de Comprobante Fiscal Electrónico (e-NCF), URL Servicios Producción (Autenticación, Recepción, Aprobación Comercial), Alta NCF (autorización para emitir comprobantes fiscales), e-CF (Comprobante Fiscal Electrónico) (+4 more)

### Community 70 - "Cotizacion Create DTO"
Cohesion: 0.18
Nodes (11): CreateCotizacionDto, ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumberString, IsOptional, IsString (+3 more)

### Community 71 - "Cotizacion Update DTO"
Cohesion: 0.18
Nodes (11): ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumberString, IsOptional, IsString, IsUUID (+3 more)

### Community 72 - "Factura Create DTO (validators)"
Cohesion: 0.18
Nodes (11): CreateFacturaDto, ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumberString, IsOptional, IsString (+3 more)

### Community 73 - "Vehiculo DTOs"
Cohesion: 0.33
Nodes (7): CreateVehiculoDto, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, UpdateVehiculoDto

### Community 74 - "Emisor Electronico Certification"
Cohesion: 0.20
Nodes (11): Rol de Aprobador Comercial, Declaración Jurada de Certificación, Aprobación o Rechazo Comercial, Estados de validación de e-CF (Aceptado, Rechazado, Aceptado Condicional, En Proceso), Etapa de Set de Pruebas (2da etapa), Pruebas de Comunicación, Pruebas de Datos, Pruebas de Simulación (+3 more)

### Community 75 - "Representacion Impresa Spec"
Cohesion: 0.20
Nodes (11): Código QR de la Representación Impresa, Pliego de Condiciones - Certificación Emisor con Proveedor, Resumen de Factura de Consumo Electrónica (< DOP 250 mil), Proceso Certificación Emisor Electrónico con Proveedor de Servicios FE Certificado, Proveedor de Servicios de FE Certificado, Modelos Ilustrativos de Representación Impresa (RI), Envío Diferido, Factura de Consumo Electrónica (+3 more)

### Community 76 - "Aseguradora DTOs"
Cohesion: 0.38
Nodes (6): CreateAseguradoraDto, IsEmail, IsNotEmpty, IsOptional, IsString, UpdateAseguradoraDto

### Community 77 - "Categoria Material DTOs"
Cohesion: 0.42
Nodes (4): CreateCategoriaMaterialDto, IsNotEmpty, IsString, UpdateCategoriaMaterialDto

### Community 78 - "Frontend Package Manifest"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 79 - "New Tecnico Modal UI"
Cohesion: 0.29
Nodes (6): NewTecnicoModal(), NewTecnicoModalProps, schema, CreateTecnicoDto, tecnicoService, UpdateTecnicoDto

### Community 80 - "New Invoice Page & Totales"
Cohesion: 0.27
Nodes (8): lineaToDraft(), NewInvoice(), aplicarCotizacion(), handleCotizacionChange(), handleOrdenChange(), calcularTotales(), LineaConMontos, redondear()

### Community 81 - "DGII Servicios Tecnica Spec"
Cohesion: 0.31
Nodes (9): Web Service Consulta de Estado de e-CF (receptores), Web Service Consulta de Resultado de e-CF (emisores), Web Service Consulta de TrackId e-CF, Web Service Recepcion de e-CF (/api/facturaselectronicas), RespuestaRecepcion XML (trackId, error, mensaje), TrackId de e-CF, Consultas de e-CF (Web DGII, Oficina Virtual OFV, App Movil), Estados del e-CF (Aceptado, Aceptado Condicional, Rechazado, En Proceso) (+1 more)

### Community 82 - "Inventory Movement Entity"
Cohesion: 0.29
Nodes (5): MovimientoInventarioController, ApiBearerAuth, Controller, Get, Param

### Community 83 - "Backend tsconfig.build"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 84 - "Color Palette Design Tokens"
Cohesion: 0.36
Nodes (8): Brand Primary Token (#145C48), Dark Theme Palette, Vyrko Color Design Tokens, Light Theme Palette, S3 + CloudFront Frontend Hosting, Vyrko / Taller Nang Yang App Shell, Theme Bootstrap Script (localStorage vyrko-theme), React + TypeScript + Vite Frontend

### Community 85 - "DGII Emisores Tecnica Spec"
Cohesion: 0.39
Nodes (8): Estandar como Receptor Electronico, URL de Aprobacion Comercial del Receptor (/fe/aprobacioncomercial/api/ecf), URL de Autenticacion Emisor-Receptor (semilla / validacioncertificado), URL de Recepcion de e-CF del Receptor (/fe/recepcion/api/ecf), Web Service de Autenticacion DGII (semilla / validarsemilla), Web Service Consulta Directorio de Servicios / Facturadores, Archivo Semilla / SemillaModel XML, Token Bearer de Autenticacion (RespuestaAutenticacion)

### Community 86 - "NestJS CLI Config"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 87 - "Backend Package Metadata"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 88 - "Backend ESLint Dependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, eslint-plugin-prettier, @types/cookie-parser, eslint, eslint-plugin-prettier, @types/cookie-parser

### Community 89 - "JWT Guard & Public Decorator"
Cohesion: 0.33
Nodes (3): IS_PUBLIC_KEY, JwtAuthGuard, Injectable

### Community 90 - "Roles Guard & Decorator"
Cohesion: 0.33
Nodes (3): ROLES_KEY, RolesGuard, Injectable

### Community 91 - "Factura Create DTO"
Cohesion: 0.29
Nodes (7): CreateFacturaLineaDto, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID

### Community 92 - "DGII Comprobante Fiscal Format"
Cohesion: 0.29
Nodes (7): Composicion del e-CF (Encabezado, Detalle, Subtotales, Descuentos/Recargos, Paginacion, Info Referencia, Fecha/Hora firma, Firma Digital), Seccion Descuentos o Recargos globales, Seccion Detalle de Bienes o Servicios (una linea por item, max 1000 lineas), Seccion Informacion de Referencia, Seccion Paginacion, Seccion Subtotales Informativos, Operacion en Contingencia (Decreto 587-24)

### Community 93 - "DGII App Firma Digital Spec"
Cohesion: 0.33
Nodes (7): App Firma Digital (herramienta DGII), Clave Privada del Certificado, Instructivo App Firma Digital, Certificado Digital Gratuito, Certificado Digital para Procedimiento Tributario, Entidad de Certificación autorizada (Viafirma, Digifirma, Novofirma), INDOTEL

### Community 95 - "DGII Certification Misc"
Cohesion: 0.40
Nodes (5): Firmado de XML (firma digital de e-CF), Postulación para ser Emisor Electrónico, URL Aprobación, URL Autenticación, URL Recepción

### Community 112 - "DGII Certification Conditions"
Cohesion: 0.50
Nodes (4): Ambiente de Pre-certificación, Etapa de Solicitud (1ra etapa), Formulario de Solicitud para ser Emisor Electrónico (FI-GDF-016), Portal de Certificación de FE

### Community 113 - "Nang Yang Logo Asset"
Cohesion: 1.00
Nodes (3): Nang Yang Logo Asset (logo-taller-nang-yang.png), Centro Automotriz Nang Yang (Auto Repair Shop Brand), Centro Automotriz Tagline & Services (Desabolladura y Pintura de Uretano en Horno)

## Ambiguous Edges - Review These
- `Graphify Knowledge Graph Workflow` → `e-CF Generation Pipeline`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to
- `XSD Schema Validation` → `DGII Accredited CAs (Viafirma / Digifirma / Novofirma)`  [AMBIGUOUS]
  docs/XML_SIGNING_STUDY_GUIDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **402 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `plugins` (+397 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **67 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Graphify Knowledge Graph Workflow` and `e-CF Generation Pipeline`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `XSD Schema Validation` and `DGII Accredited CAs (Viafirma / Digifirma / Novofirma)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Factura` connect `DGII e-CF Submission Services` to `Cotizacion Entities`, `Cliente API Module`, `e-CF Factura Entities & Indicators`, `Vehiculo Service`, `DGII Auth, Polling & Estado`, `Orden de Trabajo Entities`, `e-CF XML Builder & RFCE`, `Factura Update DTO & Estado`, `Factura DTOs`, `Backend Feature Modules`, `Factura Service`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `CotizacionService` connect `Cotizacion Service Core` to `Cotizacion DTOs & Estado`, `Cotizacion Entities`, `Cotizacion Controller`, `Orden de Trabajo DTOs`, `DGII e-CF Submission Services`, `Orden de Trabajo Entities`, `Factura DTOs`, `Backend Feature Modules`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `RolController` connect `Rol Controller` to `Rol Module`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _402 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Work Order & Payment UI` be split into smaller, more focused modules?**
  _Cohesion score 0.0608250526949714 - nodes in this community are weakly interconnected._