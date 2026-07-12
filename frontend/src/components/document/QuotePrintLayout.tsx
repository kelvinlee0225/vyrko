import { useEffect, useState } from "react";
import type { Cotizacion, CotizacionLinea } from "../../services/cotizacion";
import { empresaService, type Empresa } from "../../services/empresa";
import { formatCurrency, formatDate } from "../../utils/format";

const EMPRESA_POR_DEFECTO = {
  nombre: "Taller Nang Yang",
  rnc: "122006141",
  direccion:
    "C. La Paz No. 2, Esq. Antigua Carret. Duarte Km. 9, Sector Enriquillo, Santo Domingo, D.N.",
  telefono: "809-560-4150",
};

function importe(l: CotizacionLinea) {
  return (
    parseFloat(l.cantidad) * parseFloat(l.precioUnitario) -
    (l.descuento ? parseFloat(l.descuento) : 0)
  );
}

export function QuotePrintLayout({
  cotizacion: c,
}: {
  cotizacion: Cotizacion;
}) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);

  useEffect(() => {
    let cancelled = false;
    empresaService
      .find()
      .then((data) => {
        if (!cancelled) setEmpresa(data);
      })
      .catch(() => {
        if (!cancelled) setEmpresa(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const info = empresa ?? EMPRESA_POR_DEFECTO;
  const descuentoGlobal = c.descuentoGlobal ? parseFloat(c.descuentoGlobal) : 0;
  const hayDescuentosPorLinea = c.lineas.some((l) => l.descuento && parseFloat(l.descuento) > 0);

  return (
    <div className="hidden bg-white text-black print:block">
      <div className="mx-auto w-full max-w-[820px] p-10">
        <div className="flex items-start justify-between gap-8 border-b-2 border-black pb-4">
          <div className="flex flex-col gap-1">
            <img
              src="/logo-taller-nang-yang.png"
              alt={info.nombre}
              className="h-20 w-auto object-contain"
            />
            <div className="text-[10.5px] text-gray-600">RNC {info.rnc}</div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Cotización
            </div>
            <div className="text-[22px] font-bold tabular-nums">{c.numero}</div>
            <div className="mt-1 text-[11px] text-gray-600">
              Emitida: {formatDate(c.createdAt.slice(0, 10))}
            </div>
            <div className="mt-1 text-[11px] text-gray-600">
              Válida hasta: {' '}
              <span className="font-semibold text-black">
                {formatDate(c.fechaValidez)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-8 text-[12px] leading-[1.6]">
          <div>
            <div className="mb-1.5 text-[12px] font-extrabold uppercase tracking-wide">
              Cliente
            </div>
            <div className="font-semibold">{c.cliente.nombreRazonSocial}</div>
            <div>{c.cliente.direccion ?? "—"}</div>
            <div>{c.cliente.telefono}</div>
            <div>{c.cliente.correo ?? "—"}</div>
          </div>
          <div>
            <div className="mb-1.5 text-[12px] font-extrabold uppercase tracking-wide">
              Vehículo
            </div>
            <div className="font-semibold">
              {c.vehiculo.marca} {c.vehiculo.modelo} ({c.vehiculo.año})
            </div>
            <div>Color: {c.vehiculo.color}</div>
            <div>Placa: {c.vehiculo.placa}</div>
            <div>VIN / Chasis: {c.vehiculo.vinChasis ?? "—"}</div>
          </div>
        </div>

        <table className="mt-6 w-full border-collapse text-[11.5px]">
          <thead>
            <tr className="border-b-2 border-black bg-gray-100">
              <th className="px-3 py-2 text-left font-semibold">Descripción</th>
              <th className="px-3 py-2 text-right font-semibold">Cant.</th>
              <th className="px-3 py-2 text-right font-semibold">
                Precio unit.
              </th>
              {hayDescuentosPorLinea && (
                <th className="px-3 py-2 text-right font-semibold">Descuento</th>
              )}
              <th className="px-3 py-2 text-right font-semibold">Importe</th>
            </tr>
          </thead>
          <tbody>
            {c.lineas.map((l) => (
              <tr key={l.id} className="border-b border-gray-300">
                <td className="px-3 py-2">{l.descripcion}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {parseFloat(l.cantidad)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatCurrency(parseFloat(l.precioUnitario))}
                </td>
                {hayDescuentosPorLinea && (
                  <td className="px-3 py-2 text-right tabular-nums">
                    {l.descuento && parseFloat(l.descuento) > 0
                      ? `−${formatCurrency(parseFloat(l.descuento))}`
                      : '—'}
                  </td>
                )}
                <td className="px-3 py-2 text-right font-semibold tabular-nums">
                  {formatCurrency(importe(l))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-64 border border-black text-[12px]">
            <div className="flex justify-between border-b border-black px-3 py-1.5 tabular-nums">
              <span>Subtotal</span>
              <span>{formatCurrency(parseFloat(c.subtotal))}</span>
            </div>
            <div className="flex justify-between border-b border-black px-3 py-1.5 tabular-nums">
              <span>ITBIS (18%)</span>
              <span>{formatCurrency(parseFloat(c.itbisTotal))}</span>
            </div>
            {descuentoGlobal > 0 && (
              <div className="flex justify-between border-b border-black px-3 py-1.5 tabular-nums">
                <span>Descuento</span>
                <span>−{formatCurrency(descuentoGlobal)}</span>
              </div>
            )}
            <div className="flex justify-between px-3 py-2 text-[14px] font-bold tabular-nums">
              <span>Total</span>
              <span>{formatCurrency(parseFloat(c.total))}</span>
            </div>
          </div>
        </div>

        {c.notas && (
          <div className="mt-6 border-t border-gray-300 pt-3 text-[11px]">
            <span className="font-semibold">Nota: </span>
            {c.notas}
          </div>
        )}
      </div>
    </div>
  );
}
