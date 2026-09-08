# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: front-desk/admin staff at Taller Nang Yang, a Dominican Republic auto body and paint shop (colisión y pintura). They run the full client-facing workflow — client/vehicle intake, quotes, coordinating work orders with técnicos, and invoicing — and are the highest-frequency, highest-volume users of the system.

Secondary: shop owner/manager (oversight, inventory decisions, reporting), técnicos (execute assigned work orders, log material consumption), and supervisor/contable roles (oversight and accounting), per the rol catalog: admin, usuario, supervisor, contable.

## Product Purpose

Taller Nang Yang's internal system for running a Dominican Republic auto body/collision repair and paint shop end to end: client and vehicle intake, insurance-company coordination, quotes, work orders with técnico assignment and material consumption tracking, materials/inventory, and invoicing — including mandatory DGII (Dominican tax authority) electronic fiscal invoicing (e-CF) generated and signed directly from the invoice flow.

Success means the shop can run its full quote-to-cash cycle without leaving the system, and every fiscal invoice it issues is DGII-compliant without manual XML work.

## Positioning

Native DGII e-CF compliance is the standout mechanism: fiscal invoice XML generation, XML-DSig signing, and DGII submission/status reconciliation live directly in the invoicing flow, not as a bolt-on or manual export step a generic shop-management tool or spreadsheet would require.

## Operating Context

- Repairs are frequently insurance-claim-driven: vehículos link to an aseguradora, and the pieza/servicio catalog (bumpers, doors, glass, headlights, mirrors, trunk; "cambiar y pintar" / "reparar y pintar" / "obra A/C") reflects collision-and-paint work, not general mechanical repair.
- Workflow: cliente + vehículo intake → cotización → (accepted) orden de trabajo with técnico assignment and material consumption against inventory → factura, with e-CF generation/signing/DGII submission for qualifying invoice types (tipo 31 full e-CF, tipo 32 RFCE summary under RD$250k).
- Internal, single-shop tool: entirely staff-facing, Spanish (es-DO) UI — not a customer-facing storefront.

## Capabilities and Constraints

- Roles: admin, usuario, supervisor, contable — internal staff only, no customer-facing accounts.
- Core entities: clientes, vehículos, aseguradoras, cotizaciones, órdenes de trabajo (with técnico asignaciones and consumos), facturas, materiales/inventario (categorías, proveedores, movimientos), técnicos, secuencias NCF.
- DGII e-CF is a hard legal constraint: tipo 31/32 XML generation, XML-DSig signing, and submission against DGII's precertificación/certificación/producción environments.
- New staff accounts are admin-created with a forced password-change flow on first login, not self-signup.
- Single-tenant: the schema has one empresa record, not per-tenant scoping.

## Brand Commitments

- Business name: Taller Nang Yang (page title, logo asset `frontend/public/logo-taller-nang-yang.png`).
- Locale: Spanish, Dominican Republic (`<html lang="es-DO">`) — all UI copy is in Spanish, a hard constraint, not a translation nicety.
- Typography already wired into the app: Space Grotesk (headings) + IBM Plex Sans (body) + IBM Plex Mono (numeric/mono), loaded via Google Fonts in `index.html`.
- Light/dark theme system already implemented (`ThemeContext`, `data-theme` attribute, persisted to localStorage) with a color palette recorded in `color palette.txt` at the repo root (brand primary `#145C48` deep green, accent `#D9482A` rust-orange, plus surface/border/status tokens for both themes).

## Evidence on Hand

- Real business identity: logo (`frontend/public/logo-taller-nang-yang.png`), favicon, business name "Taller Nang Yang".
- A defined but not-yet-recorded-in-DESIGN.md visual system: color tokens (`color palette.txt`) and typography already implemented in `index.html`/Tailwind.
- No customer testimonials, case studies, or marketing copy exist — this is an internal tool with no public-facing marketing surface today; do not fabricate any.

## Product Principles

1. The DGII e-CF fiscal flow is non-negotiable and must stay correct and native to invoicing — never a manual workaround.
2. Every screen serves internal staff performing real operational tasks (Operate mode) — scanability, data density, and workflow speed outrank persuasive/marketing design.
3. Spanish (es-DO) is the only supported language; do not introduce English strings or assume a bilingual audience.
4. Collision/paint-shop domain vocabulary (cotización, orden de trabajo, e-NCF, técnico) is precise industry terminology — preserve it rather than genericizing to "job" or "ticket."
5. Single-tenant internal tool for one shop, not a multi-tenant SaaS product — do not design for tenant switching, multi-org account structures, or self-serve signup.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established yet — open question for a future round rather than an invented standard.
